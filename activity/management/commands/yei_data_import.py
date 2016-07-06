from activity.models import ThirdParty, ThirdPartyEvent
from base64 import b64encode
from customers.models import Customer
from dateutil.parser import parse, tz
from django.core.management.base import BaseCommand
from django.db import connection
from django.db.models import Q
from optparse import make_option
from org.models import Employee
import requests


class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option('--sort_dir',
            action='store',
            dest='sort_dir',
            default='',
            help='Sort (asc)ending or (desc)ending by date. Default=desc'),
        make_option('--page',
            action='store',
            dest='page',
            default='',
            help='Page number to start on. Default=1'),
        make_option('--stop_when_imported_found',
            action='store',
            dest='stop_when_imported_found',
            default='',
            help='Stop command when we find a record that we have already imported. Default=True'),
    )

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
        if options['page']:
            page = int(options['page'])
        else:
            page = 1
        if options['sort_dir']:
            sort_dir = options['sort_dir'].lower()
        else:
            sort_dir='desc'
        if options['stop_when_imported_found'] and \
            (options['stop_when_imported_found'].lower() == 'false' or \
             options['stop_when_imported_found'].lower() == 'f'):
            stop_when_imported_found = False
        else:
            stop_when_imported_found = True
        limit = 25
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant() or \
                tenant.yei_api_url is None or \
                tenant.yei_api_token is None:
            return
        # Get yei feed
        api_url = "https://%s:%s@%s/api/2/posts?filter=recognition&sort_by=date&sort_dir=%s&per_page=%s" % ('fool', tenant.yei_api_token, tenant.yei_api_url, sort_dir, limit)
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
                    third_party = ThirdParty.objects.get(name='Gold')
                except ThirdParty.DoesNotExist:
                    print "Please create a ThirdParty object for 'yei post'"
                    return
                for post in posts:
                    private = post['private']
                    owner_status = post['from']['status']
                    if not private and owner_status == 'active':
                        object_id = post['id']
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
                                        event_count = ThirdPartyEvent.objects.filter(object_id=object_id, employee_id=recipient.id).count()
                                        if event_count == 0:
                                            event = ThirdPartyEvent(object_id=object_id, employee=recipient,
                                                        owner=owner, description=description,
                                                        date=create_date, third_party=third_party)
                                            event.save()
                                            print 'Added recognition for %s from %s' % (recipient_email, owner_email)
                                        elif event_count > 0 and stop_when_imported_found:
                                            print 'All caught up!'
                                            return
                                        else:
                                            print 'Recognition already exists for %s' % recipient_email
                page += 1
            else:
                keep_alive = False
        return
