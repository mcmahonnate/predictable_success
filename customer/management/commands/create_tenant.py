from django.core.management.base import BaseCommand, CommandError
from customer.models import Client

class Command(BaseCommand):

    def handle(self, *args, **options):
        # create your public tenant
        tenant = Client(domain_url='fool.hippoculture', # don't add your port or www here! on a local server you'll want to use localhost here
                        schema_name='fool',
                        name='The Motley Fool',
                        paid_until='2026-02-24',
                        on_trial=False)
        tenant.save()
        self.stdout.write('Successfully created tenant "%s"' % tenant.name)