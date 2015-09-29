from django.core.management.base import BaseCommand
from django.db import connection
from customers.models import Customer
from org.models import Employee

class Command(BaseCommand):
    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return

        Employee.objects.rebuild()