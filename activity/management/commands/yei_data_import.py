from activity.models import ThirdParty, ThirdPartyEvent
from base64 import b64encode
from customers.models import Customer
from datetime import datetime
from dateutil.parser import parse, tz
from django.core.management.base import BaseCommand
from django.db import connection
from django.db.models import Q
from org.models import Employee
import requests


class Command(BaseCommand):
    def get_employee(self, id, email):
        try:
            employee = Employee.objects.get(Q(yei_id=id) | Q(email=email))
            if not employee.yei_id:
                employee.yei_id = id
                employee.save()
                print "Sync'd YEI account for %s" % employee.full_name
            return employee
        except Employee.DoesNotExist:
            return None

    def handle(self, *args, **options):
        page = 1
        limit = 25
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant() or \
                tenant.yei_api_url is None or \
                tenant.yei_api_token is None:
            return
        # Get yei feed
        api_url = "https://%s:%s@%s/api/2/posts?filter=recognition&sort_by=date&sort_dir=desc&per_page=%s" % ('fool', tenant.yei_api_token, tenant.yei_api_url, limit)
        headers = {'Authorization': 'Basic %s' % b64encode(tenant.yei_api_token)}
        response_code = None
        keep_alive = True
        while keep_alive and (response_code is None or response_code == 200):
            url = "%s&page=%s" % (api_url, page)
            print url
            response = requests.get(url, headers=headers)
            posts = response.json()
            response_code = response.status_code
            if len(posts) > 0:
                try:
                    third_party = ThirdParty.objects.get(name='yei post')
                except ThirdParty.DoesNotExist:
                    print "Please create a ThirdParty object for 'yei post'"
                    return
                for post in posts:
                    private = post['private']
                    owner_status = post['from']['status']
                    if not private and owner_status == 'active':
                        object_id = post['id']
                        if ThirdPartyEvent.objects.filter(object_id=object_id).count() > 0:
                            print 'All caught up!'
                            return
                        owner_id = post['from']['id']
                        owner_email = post['from']['profile_email']
                        owner = self.get_employee(id=owner_id, email=owner_email)
                        if owner is not None:
                            description = post['message']
                            date = post['created_at']
                            create_date = parse(date).astimezone(tz.tzlocal())
                            recipients = post['to']
                            for recipient in recipients:
                                if recipient['status'] == 'active':
                                    recipient_id = recipient['id']
                                    recipient_email = recipient['profile_email']
                                    recipient = self.get_employee(id=recipient_id, email=recipient_email)
                                    if recipient:
                                        event = ThirdPartyEvent(object_id=object_id, employee=recipient,
                                                    owner=owner, description=description,
                                                    date=create_date, third_party=third_party)
                                        event.save()
                                        print 'Added recognition for %s from %s' % (recipient_email, owner_email)
                page += 1
            else:
                keep_alive = False
        return
