from django.core.management.base import BaseCommand
from django.db import connection
from django.contrib.auth.models import User
from customers.models import Customer
from org.models import Employee


class Command(BaseCommand):
    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return
        for employee in Employee.objects.get_current_employees(show_hidden=True):
            if employee.user is None:
                try:
                    user = User.objects.get(email=employee.email)
                except User.DoesNotExist:
                    password = User.objects.make_random_password()
                    user_name = employee.email.split('@')[0]
                    user = User.objects.create_user(user_name, employee.email, password)
                    user.is_active = False
                    user.save()
                employee.user = user
                employee.save()
                print ('Account created for %s' % employee.full_name)
        return
