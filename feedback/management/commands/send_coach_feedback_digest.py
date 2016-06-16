from datetime import datetime
from django.core.mail import EmailMultiAlternatives
from django.core.management.base import BaseCommand
from django.db import connection
from django.db.models import Count
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
            feedback_submissions = feedback_submissions.values('subject__id', 'subject__full_name', 'subject__first_name', 'subject__avatar_small').annotate(submission_count=Count('subject__id'))
            feedback_requests = FeedbackRequest.objects.exclude(expiration_date__lt=datetime.today())
            feedback_requests = feedback_requests.filter(was_responded_to=False)
            feedback_requests = feedback_requests.filter(requester__id__in=coachee_ids).order_by('requester__full_name')
            feedback_requests = feedback_requests.values('requester__id').annotate(request_count=Count('requester__id'))
            if feedback_submissions.count() > 0:
                for submission in feedback_submissions:
                    for request in feedback_requests:
                        if request['requester__id'] == submission['subject__id']:
                            submission['request_count'] = request['request_count']
                print feedback_submissions
                feedback_submissions_count = len(feedback_submissions)
                if feedback_submissions_count > 0:
                    if feedback_submissions_count == 1:
                        subject = '%s of your Coachees has feedback waiting for them' % feedback_submissions_count
                    else:
                        subject = '%s of your Coachees have feedback waiting for them' % feedback_submissions_count
                    context = Context(
                        {
                            'site': tenant.domain_url,
                            'image_site': settings.S3_URL,
                            'feedback_submissions': feedback_submissions,
                            'num_of_coachees': feedback_submissions_count,
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