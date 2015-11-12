from django.core.management.base import BaseCommand
from django.db import connection
from org.models import Employee

class Command(BaseCommand):
    def handle(self, *args, **options):
        if connection.schema_name == 'demo':
            for employee in Employee.objects.all():
                employee.email = employee.first_name + "." + employee.last_name + "@scoutmap.com"
                employee.save()
                print employee.email
        return