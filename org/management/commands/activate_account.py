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
            help='The uid of the account to activate. Use ALL to activate all current employee accounts that are not currently active.'),
    )

    def handle(self, *args, **options):
        def activate(activate_id, tenant):
            user = User.objects.get(id=activate_id)
            if user.employee is not None and user.employee.departure_date is None:
                user.is_active = True
                user.save()
                send_activation_email.subtask((user.id, tenant.id)).apply_async()
                print user.email
            return

        if connection.schema_name == options['schema_name']:
            tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
            user_id = options['user_id']
            if user_id == 'ALL':
                confirm = raw_input('Are you sure you want to activate all current employee accounts for %s? (Y/N):' % tenant.name)
                if confirm == 'N':
                    return
                activate_ids = User.objects.filter(is_active=False, employee__departure_date__isnull=True).values_list('id', flat=True)
                print activate_ids
                for activate_id in activate_ids:
                    activate(activate_id=activate_id, tenant=tenant)
            else:
                activate(activate_id=user_id, tenant=tenant)
        return