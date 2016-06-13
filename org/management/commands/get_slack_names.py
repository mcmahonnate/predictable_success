from base64 import b64encode
from customers.models import Customer
from django.core.management.base import BaseCommand
from django.db import connection
from org.models import Employee
import requests


class Command(BaseCommand):

    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant() or \
                        not tenant.slack_api_url or \
                        not tenant.slack_api_token:
            return
        if tenant.slack_api_url is None:
            return
        print tenant.slack_api_url
        if tenant.slack_api_token is None:
            return
        print tenant.slack_api_token
        # Get slack feed
        api_url = "https://%s/users.list?token=%s&presence=0" % (tenant.slack_api_url, tenant.slack_api_token)
        headers = {'Authorization': 'Basic %s' % b64encode(tenant.slack_api_token)}
        print api_url
        response = requests.get(api_url, headers=headers)
        json = response.json()
        if len(json['members']) > 0:
            for member in json['members']:
                slack_name = member['name']
                profile = member['profile']
                if 'email' in profile:
                    email = profile['email']
                    print email
                    employee = None
                    try:
                        employee = Employee.objects.get(slack_name=slack_name, departure_date__isnull=True)
                    except Employee.DoesNotExist:
                        pass
                    if employee is None:
                        try:
                            employee = Employee.objects.get(email=email, departure_date__isnull=True)
                            employee.slack_name = slack_name
                            employee.save()
                            print '%s updated' % email
                        except Employee.DoesNotExist:
                            pass
        return
