from devzones.models import EmployeeZone
from customers.models import Customer
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
            employee_zones = EmployeeZone.objects.get_all_unfinished()
            for employee_zone in employee_zones:
                print employee_zone.employee.full_name
                response_url = 'https://%s/#/id/' % tenant.domain_url
                recipient_email = employee_zone.employee.email
                context = {
                    'recipient_first_name': employee_zone.employee.first_name,
                    'employee_full_name': employee_zone.employee.full_name,
                    'response_url': response_url,
                    'started': (employee_zone.answers.all().count() > 0)
                }
                subject = "Don't forget to take a selfie"
                if employee_zone.answers.all().count() > 0:
                    subject = "Don't forget to finish your selife"
                text_content = render_to_string('devzones/email/selfie_reminder_notification.txt', context)
                html_content = render_to_string('devzones/email/selfie_reminder_notification.html', context)
                msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
        return