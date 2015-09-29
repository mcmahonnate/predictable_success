from django.core.management.base import BaseCommand
from django.db import connection, transaction
from customers.models import Customer
from org.models import Employee

class Command(BaseCommand):
    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return
        employees = Employee.objects.get_current_employees()
        for employee in employees:
            try:
                employee.leader = employee.current_leader
                employee.save()
                print "Success updating leader for employee id %s" % employee.id
            except:
                print "Failed updating leader for employee id %s" % employee.id
