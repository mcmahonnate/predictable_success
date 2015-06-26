import os
from django.db import models, connection
from django.dispatch import receiver
from django.contrib.auth.models import User, Group
from django.conf import settings
from tenant_schemas.models import TenantMixin
from tenant_schemas.signals import post_schema_sync


class Customer(TenantMixin):
    name = models.CharField(max_length=100)
    created_on = models.DateField(auto_now_add=True)
    show_kolbe = models.BooleanField(default=False)
    show_vops = models.BooleanField(default=False)
    show_mbti = models.BooleanField(default=False)
    show_coaches = models.BooleanField(default=False)
    show_timeline = models.BooleanField(default=False)
    show_kpi = models.BooleanField(default=False)
    survey_email_subject = models.CharField(
        max_length=255,
        blank=True,
    )
    survey_email_body = models.TextField(blank=True)

    def is_public_tenant(self):
        return self.schema_name == 'public'

    def __str__(self):
        return "%s, %s" % (self.name, self.domain_url)


def current_customer():
    return Customer.objects.filter(schema_name=connection.schema_name).first()
