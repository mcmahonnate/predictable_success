from django.core.management.base import BaseCommand
from django.db import connection
from customers.models import Customer
from optparse import make_option


class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option('--schema_name',
            action='store',
            dest='schema_name',
            default='',
            help='The name of the tenant'),
    )

    def handle(self, *args, **options):
        if connection.schema_name == options['schema_name']:
            tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
            if tenant.is_public_tenant():
                print 'Not allowed to delete public tenant.'
                return
            confirm = raw_input('Deleting your schema is irreversible. Enter your schema name (%s) to confirm you want to permanently delete it:' % connection.schema_name)
            if confirm == connection.schema_name:
                tenant.delete(force_drop=True)
                print 'Schema %s has been deleted.' % connection.schema_name
                return
            print 'Delete canceled.'
            return

