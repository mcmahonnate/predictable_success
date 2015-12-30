from django.core.management.base import BaseCommand
from django.db import connection
from optparse import make_option
from customers.models import Customer
from feedback.models import FeedbackSubmission, FeedbackDigest
from org.models import Employee
from django.db.models import Q
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings


class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option('--schema_name',
            action='store',
            dest='schema_name',
            default='',
            help='The name of the tenant'),
        make_option('--user_id',
            action='store',
            dest='user_id',
            default='',
            help='The uid of the account to send the email to. Use ALL to email all accounts whose feedback was helpful.'),
    )

    def handle(self, *args, **options):
        if connection.schema_name == options['schema_name']:
            tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
            user_id = options['user_id']

            if user_id != 'ALL':
                employees = Employee.objects.filter(user__id=user_id)
            else:
                employees = Employee.objects.get_current_employees(show_hidden=True)

            for employee in employees:
                try:
                    current_digest = FeedbackDigest.objects.get_current_delivered_for_employee(employee)
                    helpful_submissions = FeedbackSubmission.objects.filter(Q(excels_at_was_helpful=True) | Q(could_improve_on_was_helpful=True))
                    helpful_submissions = helpful_submissions.filter(subject__id=employee.id)
                    feedback_url = 'https://%s/#/feedback/' % tenant.domain_url
                    context = {
                        'recipient_first_name': employee.first_name,
                        'helpful_submissions': helpful_submissions,
                        'digest_id': current_digest.id,
                        'feedback_url': feedback_url,
                    }
                    subject = "You asked for it"
                    text_content = render_to_string('email/feedback_update_helpful.txt', context)
                    html_content = render_to_string('email/feedback_update_helpful.html', context)
                    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [employee.email])
                    msg.attach_alternative(html_content, "text/html")
                    msg.send()
                except FeedbackDigest.DoesNotExist:
                    pass
        return