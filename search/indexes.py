import pysolr
from django.conf import settings
from comp.models import CompensationSummary
from urllib import urlencode
import requests
import time
import uuid
from hashlib import sha1
import hmac


class EmployeeIndex(object):
    def __init__(self):
        self.solr = pysolr.Solr(settings.EMPLOYEES_SOLR_URL, timeout=10)

    def delete(self, employee, tenant):
        """ Removes the Employee from the index."""
        document_id = self._generate_document_id(tenant, employee)
        self.solr.delete(id=document_id, headers=self._get_auth_headers())

    def process(self, employees, tenant):
        """Adds or removes the Employees from the index."""
        documents = []

        for employee in employees:
            if employee.departure_date is not None:
                self.delete(employee, tenant)
            else:
                document_id = self._generate_document_id(tenant, employee)
                try:
                    comp = employee.comp.get_most_recent().first()
                except CompensationSummary.DoesNotExist:
                    comp = None
                leader = employee.current_leader
                team = employee.team
                happiness = employee.current_happiness
                document = {
                    'id': document_id,
                    'pk': employee.id,
                    'tenant': tenant.schema_name,
                    'full_name': employee.full_name,
                    'first_name': employee.first_name,
                    'last_name': employee.last_name,
                    'email': employee.email,
                    'avatar': employee.avatar.url if employee.avatar else '',
                    'avatar_small': employee.avatar_small.url if employee.avatar_small else '',
                    'job_title': employee.job_title,
                    'hire_date': employee.hire_date,
                    'happiness': happiness.assessment if happiness else 0,
                    'happiness_date': happiness.assessed_date if happiness else None,
                    'kolbe_fact_finder': employee.get_kolbe_fact_finder,
                    'kolbe_follow_thru': employee.get_kolbe_follow_thru,
                    'kolbe_quick_start': employee.get_kolbe_quick_start,
                    'kolbe_implementor': employee.get_kolbe_implementor,
                    'vops_visionary': employee.get_vops_visionary,
                    'vops_operator': employee.get_vops_operator,
                    'vops_processor': employee.get_vops_processor,
                    'vops_synergist': employee.get_vops_synergist,
                    'last_checkin_about': employee.last_checkin_about.date if employee.last_checkin_about else None,
                    'last_comment_about': employee.last_comment_about.created_date if employee.last_comment_about else None,
                    'departure_date': employee.departure_date,
                    'team_id': team.id if team else None,
                    'team_name': team.name if team else None,
                    'display': employee.display,
                    'current_salary': comp.salary if comp else None,
                    'current_bonus': comp.bonus if comp else None,
                    'talent_category': employee.current_talent_category(),
                    'talent_category_date': employee.current_talent_category_date(),
                    'coach_id': employee.coach.id if employee.coach else None,
                    'coach_full_name': employee.coach.full_name if employee.coach else None,
                    'leader_id': leader.id if leader else None,
                    'leader_full_name': leader.full_name if leader else None,
                }
                documents.append(document)

        self._index_documents(documents)

    def find_employees(self, tenant,
                       talent_categories=None,
                       team_ids=None,
                       happiness=None,
                       vops=None,
                       coach_ids=None,
                       leader_ids=None,
                       page=1,
                       rows=10):
        query = {
            'sort': 'full_name asc',
            'rows': rows,
            'start': self._get_start(page, rows),
            'fq': self._get_filters(tenant, talent_categories=talent_categories, team_ids=team_ids,
                                    happiness=happiness, coach_ids=coach_ids, leader_ids=leader_ids),
        }
        if vops:
            query['fq'].append('vops_%s:[260 TO *]' % vops.lower())

        results = self.solr.search('*:*', headers=self._get_auth_headers(), **query)
        return results

    def get_salary_report(self, tenant, talent_categories=None, team_ids=None, happiness=None, leader_ids=None,
                          coach_ids=None):
        query = {
            'q': '*:*',
            'wt': 'json',
            'rows': 0,
            'stats': 'true',
            'stats.facet': 'talent_category',
            "stats.field": "current_salary",
            'fq': self._get_filters(tenant, talent_categories=talent_categories, team_ids=team_ids, happiness=happiness,
                                    leader_ids=leader_ids, coach_ids=coach_ids),
        }

        query_string = urlencode(query, doseq=True)
        url = "%s/select?%s" % (settings.EMPLOYEES_SOLR_URL, query_string)
        results = requests.get(url, headers=self._get_auth_headers()).json()

        results = results['stats']['stats_fields']['current_salary']

        if results is None:
            return results

        report = {
            'count': results['count'],
            'total_salaries': results['sum'],
            'categories': {},
        }

        for key in results['facets']['talent_category']:
            category = results['facets']['talent_category'][key]

            value = {
                'count': category['count'],
                'salaries': category['sum']
            }
            report['categories'][key] = value
        return report

    def get_talent_report(self, tenant, talent_categories=None, team_ids=None, happiness=None, leader_ids=None,
                          coach_ids=None):
        query = {
            'q': '*:*',
            'wt': 'json',
            'rows': 0,
            'facet': 'true',
            "facet.field": "talent_category",
            'fq': self._get_filters(tenant, talent_categories=talent_categories, team_ids=team_ids, happiness=happiness,
                                    leader_ids=leader_ids, coach_ids=coach_ids),
        }

        query_string = urlencode(query, doseq=True)
        url = "%s/select?%s" % (settings.EMPLOYEES_SOLR_URL, query_string)
        results = requests.get(url, headers=self._get_auth_headers()).json()
        count = results['response']['numFound']
        results = results['facet_counts']['facet_fields']['talent_category']

        if results is None:
            return results

        report = {
            'count': count,
            'categories': dict(zip(results[0::2], results[1::2])),
        }

        return report

    def _get_start(self, page, rows):
        return rows * (page - 1)

    def _get_auth_headers(self):
        timestamp = int(time.time())
        nonce = str(uuid.uuid4())
        auth = hmac.new(
            settings.WEBSOLR_SECRET,
            '%s%s' % (timestamp, nonce),
            sha1
        ).hexdigest()

        return {
            'X-Websolr-Time': timestamp,
            'X-Websolr-Nonce': nonce,
            'X-Websolr-Auth': auth
        }

    def _index_documents(self, documents):
        step = 100
        for i in range(0, len(documents), step):
            batch = documents[i:i + step]
            self.solr.add(batch, headers=self._get_auth_headers())

    def _generate_document_id(self, tenant, employee):
        return '%s-%s' % (tenant.schema_name, employee.id)

    def _get_filter_string(self, field_name, values, operator='OR'):
        operator = ' %s ' % operator
        if values is None or len(values) == 0:
            return ''
        if len(values) == 1:
            return '%s:%s' % (field_name, values[0])
        else:
            return '%s:(%s)' % (field_name, operator.join(values))

    def _add_filters(self, filters, field_name, values, operator='OR'):
        if values is None or len(values) == 0:
            return
        filters.append(self._get_filter_string(field_name, values, operator=operator))

    def _get_filters(self, tenant, talent_categories=None, team_ids=None, happiness=None, leader_ids=None,
                     coach_ids=None, display=True):
        filters = ['tenant:%s' % tenant.schema_name]
        self._add_filters(filters, 'talent_category', talent_categories)
        self._add_filters(filters, 'team_id', team_ids)
        self._add_filters(filters, 'happiness', happiness)
        self._add_filters(filters, 'leader_id', leader_ids)
        self._add_filters(filters, 'coach_id', coach_ids)
        self._add_filters(filters, 'display', ['true'] if display else ['false'])
        return filters
