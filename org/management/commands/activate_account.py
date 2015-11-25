from django.core.management.base import BaseCommand
from django.db import connection
from django.contrib.auth.models import User
from optparse import make_option
from customers.models import Customer
from org.tasks import send_activation_email
import string


class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option('--schema_name',
            action='store',
            dest='schema_name',
            default='',
            help='The name of the tenant'),
        make_option('--user_id',
            action='store',
            dest='user_id',
            default='',
            help='The uid of the account to activate'),
    )

    def handle(self, *args, **options):
        if connection.schema_name == options['schema_name']:
            tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
            user_id = options['user_id']
            user = User.objects.get(id=user_id)
            if user.employee is not None and user.employee.departure_date is None:
                user.is_active = True
                user.save()
                send_activation_email.subtask((user.id, tenant.id)).apply_async()
                print user.email
        return