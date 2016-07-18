from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.db import connection
from customers.models import Customer
from feedback.models import FeedbackSubmission


class Command(BaseCommand):

    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return
        archive_date = datetime.now() - timedelta(weeks=12)
        print archive_date
        submissions = FeedbackSubmission.objects.all()
        submissions = submissions.filter(has_been_delivered=False, choose_not_to_deliver=False)
        submissions = submissions.filter(feedback_date__lt=archive_date).order_by('feedback_date')

        for submission in submissions:
            submission.choose_not_to_deliver = True
            submission.choose_not_to_deliver_reason = 'This feedback was not delivered beacuse it was either delivered in person, summarized or the person no longer works at the Fool.'
            submission.save()
            print "Archived undelievered feedback for %s that %s gave on %s." % (submission.subject.full_name,
                                                     submission.reviewer.full_name, submission.feedback_date)
