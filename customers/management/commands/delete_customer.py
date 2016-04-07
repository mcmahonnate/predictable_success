from django.core.management.base import BaseCommand
from django.db import connection
from customers.models import Customer


class Command(BaseCommand):
    def handle(self, *args, **options):
        confirm = raw_input('Deleting your schema is irreversible. Enter your schema name (%s) to confirm you want to permanently delete it:' % connection.schema_name)
        if confirm != connection.schema_name:
            return
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        tenant.delete(force_drop=True)
        print 'Schema %s has been deleted.' % connection.schema_name
        return