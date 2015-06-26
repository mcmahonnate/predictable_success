from django.core.management.base import BaseCommand
from django.db import connection
import logging
from customers.models import Customer
from django.contrib.sites.models import Site

logger = logging.getLogger(__name__)


class Command(BaseCommand):

    def handle(self, *args, **options):
        customer = Customer.objects.filter(schema_name=connection.schema_name).first()
        if customer.is_public_tenant():
            return

        site = Site.objects.get_current()

        if site_isnt_syncd_with_customer(site, customer):
            sync(site, customer)
        else:
            print "Site and Customer are already sync'd"


def site_isnt_syncd_with_customer(site, customer):
    return site.domain != customer.domain_url or site.name != customer.name


def sync(site, customer):
    print ("Syncing site.domain from {0} to {1}".format(site.domain, customer.domain_url))
    site.domain = customer.domain_url
    print ("Syncing site.name from {0} to {1}".format(site.name, customer.name))
    site.name = customer.name
    site.save()


