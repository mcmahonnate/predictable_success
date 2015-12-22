from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.db import connection
from django.db import models
from optparse import make_option
from feedback.models import FeedbackSubmission
from feedback.tasks import send_feedback_was_helpful_email


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
        make_option('--days_ago',
            action='store',
            dest='days_ago',
            default='7',
            help='The numbers of days to look back.'),
    )

    def handle(self, *args, **options):
        if connection.schema_name == options['schema_name']:
            user_id = options['user_id']
            days_ago = options['days_ago']
            date_now = datetime.now()
            date_days_ago = date_now - timedelta(days=int(days_ago))
            helpful_submissions = FeedbackSubmission.objects.was_helpful(start_date=date_days_ago, end_date=date_now)
            if user_id != 'ALL':
                helpful_submissions = helpful_submissions.filter(reviewer__user__id=user_id)
            helpful_submissions = helpful_submissions.order_by().values('reviewer').annotate(helpful=models.Count("pk"))
            for helpful_submission in helpful_submissions:
                employee_id = helpful_submission['reviewer']
                helpful_count = helpful_submission['helpful']
                send_feedback_was_helpful_email.subtask((employee_id, helpful_count, days_ago)).apply_async()
                print helpful_submission['reviewer']
        return