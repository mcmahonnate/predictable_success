import os
from django.db import connection
from django.dispatch import receiver
from django.contrib.auth.models import User, Group
from django.conf import settings
from tenant_schemas.signals import post_schema_sync

@receiver(post_schema_sync)
def create_initial_user_and_set_site(sender, **kwargs):
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