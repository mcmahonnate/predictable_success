import pysolr
from comp.models import CompensationSummary
from urllib import urlencode
from . import get_solr_url
import requests


class EmployeeIndex(object):
    def __init__(self):
        self.solr = pysolr.Solr(get_solr_url('employees'), timeout=10)

    def index_employee(self, e, tenant):
        try:
            comp = e.comp.get_most_recent().first()
        except CompensationSummary.DoesNotExist:
            comp = None
        leader = e.current_leader
        team = e.team
        happiness = e.current_happiness
        document = {
            'id': '%s-%s' % (tenant.schema_name, e.id),
            'pk': e.id,
            'tenant': tenant.schema_name,
            'full_name': e.full_name,
            'first_name': e.first_name,
            'last_name': e.last_name,
            'email': e.email,
            'avatar': e.avatar,
            'avatar_small': e.avatar_small,
            'job_title': e.job_title,
            'hire_date': e.hire_date,
            'happiness': happiness.assessment if happiness else 0,
            'happiness_date': happiness.assessed_date if happiness else None,
            'kolbe_fact_finder': e.get_kolbe_fact_finder,
            'kolbe_follow_thru': e.get_kolbe_follow_thru,
            'kolbe_quick_start': e.get_kolbe_quick_start,
            'kolbe_implementor': e.get_kolbe_implementor,
            'vops_visionary': e.get_vops_visionary,
            'vops_operator': e.get_vops_operator,
            'vops_processor': e.get_vops_processor,
            'vops_synergist': e.get_vops_synergist,
            'departure_date': e.departure_date,
            'team_id': team.id if team else None,
            'team_name': team.name if team else None,
            'display': e.display,
            'current_salary': comp.salary if comp else None,
            'current_bonus': comp.bonus if comp else None,
            'talent_category': e.current_talent_category(),
            'coach_id': e.coach.id if e.coach else None,
            'coach_full_name': e.coach.full_name if e.coach else None,
            'leader_id': leader.id if leader else None,
            'leader_full_name': leader.full_name if leader else None,
        }
        self.solr.add([document])

    def get_filter_string(self, field_name, values, operator='OR'):
        operator = ' %s ' % operator
        if values is None or len(values) == 0:
            return ''
        if len(values) == 1:
            return '%s:%s' % (field_name, values[0])
        else:
            return '%s:(%s)' % (field_name, operator.join(values))

    def add_filters(self, filters, field_name, values, operator='OR'):
        if values is None or len(values) == 0:
            return
        filters.append(self.get_filter_string(field_name, values, operator=operator))

    def get_filters(self, tenant, talent_categories=None, team_ids=None, happiness=None, leader_ids=None, coach_ids=None):
        filters = ['tenant:%s' % tenant.schema_name]
        self.add_filters(filters, 'talent_category', talent_categories)
        self.add_filters(filters, 'team_id', team_ids)
        self.add_filters(filters, 'happiness', happiness)
        self.add_filters(filters, 'leader_id', leader_ids)
        self.add_filters(filters, 'coach_id', coach_ids)
        return filters

    def find_employees(self, tenant, talent_categories=None, team_ids=None, happiness=None):
        query = {
            'sort': 'full_name asc',
            'rows': 500,
            'fq': self.get_filters(tenant, talent_categories=talent_categories, team_ids=team_ids, happiness=happiness),
        }
        return self.solr.search('*:*', **query)

    def get_talent_report(self, tenant, talent_categories=None, team_ids=None, happiness=None, leader_ids=None, coach_ids=None):
        query = {
            'q': '*:*',
            'wt': 'json',
            'rows': 0,
            'stats': 'true',
            'stats.facet': 'talent_category',
            "stats.field": "current_salary",
            'fq': self.get_filters(tenant, talent_categories=talent_categories, team_ids=team_ids, happiness=happiness, leader_ids=leader_ids, coach_ids=coach_ids),
        }
        query_string = urlencode(query, doseq=True)
        url = "%s/select?%s" % (get_solr_url('employees'), query_string)
        results = requests.get(url).json()
        return results['stats']['stats_fields']['current_salary']
