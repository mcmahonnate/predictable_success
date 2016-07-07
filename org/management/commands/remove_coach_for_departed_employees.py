from customers.models import Customer
from django.core.management.base import BaseCommand
from django.db import connection
from org.models import Employee


class Command(BaseCommand):
    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant() or \
                not tenant.namely_api_url or \
                not tenant.namely_api_token:
            return
        for employee in Employee.objects.filter(departure_date__isnull=False, coach__isnull=False):
            employee.coach = None
            employee.save()
            print employee.full_name
        return