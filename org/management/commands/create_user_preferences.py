from django.core.management.base import BaseCommand
from django.db import connection
from customers.models import Customer
from org.models import Employee
from preferences.models import UserPreferences


class Command(BaseCommand):
    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return
        for employee in Employee.objects.get_current_employees(show_hidden=True).filter(user__isnull=False):
            user = employee.user
            try:
                preferences = user.preferences
            except UserPreferences.DoesNotExist:
                preferences = UserPreferences(user=user)
                preferences.save()
                print ('User preferences created for %s' % employee.full_name)
        return
