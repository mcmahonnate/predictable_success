from customers.models import Customer
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import connection
from optparse import make_option
from org.models import Employee
import requests


class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option('--user_id',
            action='store',
            dest='user_id',
            default='',
            help='The uid of the account to update. Use ALL to update all current employee accounts.'),
    )

    def handle(self, *args, **options):
        limit = 25
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
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
                    reports_to_id = profile['reports_to'][0]['id']
                    try:
                        employee = Employee.objects.get(namely_id=namely_id)
                        lead = Employee.objects.get(namely_id=reports_to_id)
                        if employee.current_leader.id != lead.id:
                            employee.current_leader = lead
                            employee.save()
                            print "Updated %s's manager to %s" % (employee.full_name % lead.full_name)
                    except Employee.DoesNotExist:
                        pass
                    last_record = namely_id
            else:
                keep_alive = False
        return
