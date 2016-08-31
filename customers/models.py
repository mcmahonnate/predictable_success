from django.conf import settings
from django.db import models, connection
from tenant_schemas.models import TenantMixin


class Customer(TenantMixin):
    name = models.CharField(max_length=100)
    namely_api_url = models.CharField(max_length=255, blank=True)
    namely_api_token = models.CharField(max_length=255, blank=True)
    slack_url = models.CharField(max_length=255, blank=True)
    slack_api_url = models.CharField(max_length=255, blank=True)
    slack_api_token = models.CharField(max_length=255, blank=True)
    slack_bot = models.CharField(max_length=255, blank=True)
    created_on = models.DateField(auto_now_add=True)
    show_individual_comp = models.BooleanField(default=True)
    show_qualities = models.BooleanField(default=False)
    activation_email = models.TextField(default="Welcome to Scoutmap!")

    def is_public_tenant(self):
        return self.schema_name == 'public'

    def build_url(self, path):
        port = ":%s" % settings.SITE_PORT if settings.SITE_PORT else ''
        return "%s%s%s%s" % (settings.SITE_PROTOCOL, self.domain_url, port, path)

    def __str__(self):
        return "%s, %s" % (self.name, self.domain_url)


def current_customer():
    return Customer.objects.filter(schema_name=connection.schema_name).first()
