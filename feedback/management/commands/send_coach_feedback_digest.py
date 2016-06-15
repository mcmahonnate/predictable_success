from django.core.mail import EmailMultiAlternatives
from django.core.management.base import BaseCommand
from django.db import connection
from django.db.models import Count
from django.conf import settings
from django.template import Context
from django.template.loader import render_to_string
from django.conf import settings
from customers.models import Customer
from org.models import Employee
from feedback.models import FeedbackSubmission


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
            feedback_submissions = feedback_submissions.values('subject__id', 'subject__full_name', 'subject__avatar_small').annotate(submission_count=Count('subject__id'))
            submissions_count = feedback_submissions.count()
            if submissions_count > 0:
                if submissions_count == 1:
                    subject = '%s of your Coachees has feedback waiting for them' % submissions_count
                else:
                    subject = '%s of your Coachees have feedback waiting for them' % submissions_count
                context = Context(
                    {
                        'site': tenant.domain_url,
                        'image_site': settings.S3_URL,
                        'feedback_submissions': feedback_submissions,
                        'num_of_coachees': submissions_count,
                        'coach': coach
                    }
                )
                text_content = render_to_string('feedback/email/feedback_weekly_report_notification.txt', context)
                html_content = render_to_string('feedback/email/feedback_weekly_report_notification.html', context)

                msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [coach.email])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                print 'Successfully sent Weekly Feedback Report for %s.' % coach.full_name
            else:
                print 'No Feedback activity to report for %s.' % coach.full_name
        return