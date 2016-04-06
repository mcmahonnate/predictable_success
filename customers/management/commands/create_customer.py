from django.core.management.base import BaseCommand
from django.db import connection
import logging
from customers.models import Customer
from optparse import make_option
from django.contrib.sites.models import Site

logger = logging.getLogger(__name__)


class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option('--tenant_name',
            action='store',
            dest='tenant_name',
            default='',
            help='The name of the tenant'),
        make_option('--url',
            action='store',
            dest='url',
            default='',
            help='The url of the customer site i.e. company.scoutmap.com.'),
        make_option('--company_name',
            action='store',
            dest='company_name',
            default='',
            help='The display name of the comapny.'),
    )

    def handle(self, *args, **options):
        def validate():
            if not options['tenant_name']:
                print 'tenant_name is a required option for this command'
                return False
            if not options['url']:
                print 'url is a required option for this command'
                return False
            if not options['company_name']:
                print 'company_name is a required option for this command'
                return False
            return True
        customer = Customer.objects.filter(schema_name=connection.schema_name).first()
        if customer.is_public_tenant():
            if validate():
                schema_name = options['tenant_name']
                url = options['url']
                company_name = options['company_name']
                customer = Customer(domain_url=url, schema_name=schema_name, name=company_name)
                customer.save()
                print customer.domain_url
        return