from django.core.management.base import BaseCommand
from django.db import connection
from org.models import Employee

class Command(BaseCommand):
    def handle(self, *args, **options):
        if connection.schema_name == 'demo':
            for employee in Employee.objects.all():
                if (employee.first_name is None) and (employee.full_name is not None):
                    full_name = employee.full_name
                    employee.first_name = full_name.split()[0]
                    employee.last_name = full_name.split()[1]
                    employee.save()
                    print ('%s %s' % (employee.first_name, employee.last_name))
        return
