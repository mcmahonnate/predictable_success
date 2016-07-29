import requests
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.db import connection
from django.db.models.query_utils import Q
from optparse import make_option
from customers.models import Customer
from org.models import Employee
from feedback.models import FeedbackRequest

class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option('--user_id',
            action='store',
            dest='user_id',
            default='',
            help='The uid of the account to send the email to. Use ALL to email all accounts that having pending requests.'),
    )

    def get_day_of_week(self):
        day_of_week = datetime.today().weekday()
        # Make datetime's weekday django friendly since dateime weekday (0=Monday and 6=Sunday)
        # and Django filter weekday (1=Sunday and 7=Saturday)
        day_of_week = 1 if day_of_week == 6 else (day_of_week + 2)
        return day_of_week

    def get_requests(self, employee):
        day_of_week = self.get_day_of_week()
        pending_requests = FeedbackRequest.objects.pending_for_reviewer(reviewer=employee)
        if day_of_week == 6:
            start_date = datetime.today() + timedelta(days=1)
            end_date = datetime.today() + timedelta(days=3)
            pending_requests.filter(Q(expiration_date__gte=start_date) and Q(expiration_date__lte=end_date))
        elif day_of_week > 2:
            tomorrow = datetime.today() + timedelta(days=1)
            pending_requests.filter(expiration_date=tomorrow)
        else:
            return []
        return pending_requests

    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant() or tenant.slack_bot is None:
            return
        user_id = options['user_id']
        if user_id == 'ALL':
            employees = Employee.objects.get_current_employees(show_hidden=True)

            for employee in employees:
                if employee.slack_name:
                    pending_requests = self.get_requests(employee)
                    if pending_requests.count() > 0:
                        print employee.full_name
                        self.send_slack_message(pending_requests, employee.slack_name, tenant.slack_bot, tenant.domain_url)
        else:
            employee = Employee.objects.get(user__id=user_id)
            if employee.slack_name:
                pending_requests = self.get_requests(employee)
                if pending_requests.count() > 0:
                    print employee.full_name
                    self.send_slack_message(pending_requests, employee.slack_name, tenant.slack_bot, tenant.domain_url)
        return

    def send_slack_message(self, pending_requests, to, slack_bot, domain_url):
        day_of_week = self.get_day_of_week()
        if day_of_week == 6:
            when = 'this weekend'
        else:
            when = 'tomorrow'
        links = '\r\n'
        for pending_request in  pending_requests:
            link = "%s - <https://%s/#/feedback/request/%s/reply/| Give feedback>\r\n" % (pending_request.requester.full_name, domain_url, pending_request.id)
            links = links + link
        text = ":octopusbounce: Hurry, hurry the following people's feedback request will expire %s: %s" % (when, links)
        channel = "@%s" % to
        data = {"channel": channel, "text": text}
        requests.post(slack_bot, json=data)