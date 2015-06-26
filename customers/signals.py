import os
from django.db import connection
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User, Group
from django.contrib.sites.models import Site
from django.conf import settings
from tenant_schemas.signals import post_schema_sync
from management.commands.sync_sites_and_customers import site_isnt_syncd_with_customer, sync
from .models import Customer


@receiver(post_schema_sync)
def create_initial_user(sender, **kwargs):
    tenant = kwargs['tenant']
    connection.set_tenant(tenant)
    try:
        username = tenant.schema_name + 'admin'
        if not User.objects.filter(username=username).exists():
            user = User(username=username, is_staff=True, is_superuser=True)
            password = os.environ.get('NEW_CUSTOMER_PWD')
            user.set_password(password)
            user.save()

        for name in settings.REQUIRED_GROUPS:
            if not Group.objects.filter(name=name).exists():
                Group(name=name).save()
    except:
        pass
    connection.set_schema_to_public()


@receiver(post_save, sender=Customer)
def sync_site_with_customer(sender, **kwargs):
    customer = kwargs['instance']
    connection.set_tenant(customer)
    try:
        site = Site.objects.get_current()

        if site_isnt_syncd_with_customer(site, customer):
            sync(site, customer)
    except:
        pass
    connection.set_schema_to_public()
