from django.core.mail import EmailMultiAlternatives
from django.core.management.base import BaseCommand
from django.db import connection
from django.template import Context
from django.template.loader import render_to_string
from django.conf import settings
from customers.models import Customer
from org.models import Employee
from feedback.models import FeedbackRequest, FeedbackSubmission


class Command(BaseCommand):

    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return

        coaches = Employee.objects.get_coaches()

        for coach in coaches:
            feedback_submissions = FeedbackSubmission.objects.received_not_delivered()
            coachee_ids = coach.coachees.values_list('id', flat=True)
            feedback_submissions = feedback_submissions.filter(subject__id__in=coachee_ids).order_by('subject__full_name')
            if feedback_submissions.count() > 0:
                subject = 'Weekly Feedback Report'
                context = Context(
                    {
                        'site': tenant.domain_url,
                        'feedback_submissions': feedback_submissions,
                        'coach': coach
                    }
                )
                text_content = render_to_string('checkins/email/checkin_share_reminder_notification.txt', context)
                html_content = render_to_string('checkins/email/checkin_share_reminder_notification.html', context)

                msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [coach.email])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                print 'Successfully sent Weekly Feedback Report for %s.' % coach.full_name
            else:
                print 'No Feedback activity to report for %s.' % coach.full_name
        return