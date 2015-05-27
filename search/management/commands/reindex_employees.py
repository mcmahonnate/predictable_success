from django.core.management.base import BaseCommand
from django.db import connection
import pysolr
from customers.models import Customer
from org.models import Employee
from comp.models import CompensationSummary

class Command(BaseCommand):
    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return

        employees = Employee.objects.all()

        solr = pysolr.Solr("http://localhost:8983/solr/employees/", timeout=10)
        document_count = 0

        for e in employees:
            try:
                comp = e.comp.get_most_recent().first()
            except CompensationSummary.DoesNotExist:
                comp = None

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
                'talent_category': e.current_talent_category()
            }

            solr.add([document])
            document_count += 1
        print "Indexed %s employees" % document_count
