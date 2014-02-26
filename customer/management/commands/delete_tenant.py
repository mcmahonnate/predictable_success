from django.core.management.base import BaseCommand, CommandError
from customer.models import Client

class Command(BaseCommand):

    def handle(self, *args, **options):
        for tenant_id in args:
            # create your public tenant
            tenant = Client.objects.get(id=int(tenant_id))
            tenant.delete()
            self.stdout.write('Successfully deleted tenant "%s"' % tenant_id)