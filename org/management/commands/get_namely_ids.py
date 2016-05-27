from customers.models import Customer
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import connection
from org.models import Employee
import requests


class Command(BaseCommand):

    def handle(self, *args, **options):
        limit = 25
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant() or \
                tenant.namely_api_url is None or \
                tenant.namely_api_token is None:
            return
        # Get namely feed
        api_url = "https://%s/profiles.json?filter[user_status]=active&sort=first_name&limit=%s" % (tenant.namely_api_url, limit)
        headers = {'Authorization': 'Bearer %s' % tenant.namely_api_token}
        response_code = None
        keep_alive = True
        last_record = None
        while keep_alive and (response_code is None or response_code == 200):
            url = "%s&after=%s" % (api_url, last_record)
            print url
            response = requests.get(url, headers=headers)
            json = response.json()
            response_code = response.status_code
            if len(json['profiles']) > 0:
                for profile in json['profiles']:
                    namely_id = profile['id']
                    email = profile['email']
                    print email
                    employee = None
                    try:
                        employee = Employee.objects.get(namely_id=namely_id, departure_date__isnull=True)
                    except Employee.DoesNotExist:
                        pass
                    if employee is None:
                        try:
                            employee = Employee.objects.get(email=email, departure_date__isnull=True)
                            employee.namely_id = namely_id
                            employee.save()
                            print '%s updated' % email
                        except Employee.DoesNotExist:
                            pass
                    last_record = namely_id
            else:
                keep_alive = False
        return
