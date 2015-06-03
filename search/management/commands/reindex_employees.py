from django.core.management.base import BaseCommand
from django.db import connection
from customers.models import Customer
from org.models import Employee
from ...indexes import EmployeeIndex


class Command(BaseCommand):

    def handle(self, *args, **options):
        indexer = EmployeeIndex()
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return

        employees = Employee.objects.all()

        document_count = 0

        indexer.process(employees, tenant)

        print 'Indexed %s employees' % len(employees)