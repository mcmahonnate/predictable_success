from base64 import b64encode
from customers.models import Customer
from django.core.management.base import BaseCommand
from django.db import connection
from org.models import Employee
import requests


class Command(BaseCommand):

    def handle(self, *args, **options):
        page = 1
        limit = 25
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant() or \
                tenant.yei_api_url is None or \
                tenant.yei_api_token is None:
            return
        # Get yei feed
        api_url = "https://%s:%s@%s/api/2/user_profiles?filter=active&per_page=%s" % ('fool', tenant.yei_api_token, tenant.yei_api_url, limit)
        headers = {'Authorization': 'Basic %s' % b64encode(tenant.yei_api_token)}
        response_code = None
        keep_alive = True
        while keep_alive and (response_code is None or response_code == 200):
            url = "%s&page=%s" % (api_url, page)
            print url
            response = requests.get(url, headers=headers)
            profiles = response.json()
            response_code = response.status_code
            if len(profiles) > 0:
                for profile in profiles:
                    yei_id = profile['id']
                    email = profile['email']
                    print email
                    employee = None
                    try:
                        employee = Employee.objects.get(yei_id=yei_id, departure_date__isnull=True)
                    except Employee.DoesNotExist:
                        pass
                    if employee is None:
                        try:
                            employee = Employee.objects.get(email=email, departure_date__isnull=True)
                            employee.yei_id = yei_id
                            employee.save()
                            print '%s updated' % email
                        except Employee.DoesNotExist:
                            pass
                page += 1
            else:
                keep_alive = False
        return
