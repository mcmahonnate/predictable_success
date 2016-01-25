from checkins.models import CheckIn
from customers.models import Customer
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from optparse import make_option


class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option('--schema_name',
            action='store',
            dest='schema_name',
            default='',
            help='The name of the tenant'),
    )

    def handle(self, *args, **options):
        if connection.schema_name == options['schema_name']:
            tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
            checkins = CheckIn.objects.get_all_send_reminders()
            for checkin in checkins:
                print checkin.host.full_name
                response_url = 'https://%s/#/checkins/%d/' % (tenant.domain_url, checkin.id)
                recipient_email = checkin.host.email
                context = {
                    'recipient_first_name': checkin.host.first_name,
                    'employee_full_name': checkin.employee.full_name,
                    'response_url': response_url,
                }
                subject = "%s is waiting for their check-in notes" % checkin.employee.full_name
                text_content = render_to_string('checkins/email/checkin_send_to_employee_reminder_notification.txt', context)
                html_content = render_to_string('checkins/email/checkin_send_to_employee_reminder_notification.html', context)
                msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
        return