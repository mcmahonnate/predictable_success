from django.core.management.base import BaseCommand, CommandError
from django.core.mail import send_mail
from datetime import datetime, timedelta
from django.utils.dateformat import DateFormat
from django.contrib.auth.models import User
from blah.models import Comment

class Command(BaseCommand):

    def handle(self, *args, **options):
        dt = datetime.now()
        start_dt = dt-timedelta(days=1)
        comments = Comment.objects.filter(created_date__range=[start_dt,dt])
        message = None
        for comment in comments:
            self.stdout.write(comment.content)
            message = message + comment.content
        if message is not None:
            recipients = User.objects.filter(groups__id=3)
            recipient_list = None
            if recipient_list  is not None:
                for recipient in recipients:
                    recipient_list = recipient_list + recipient.email
                df = DateFormat(dt)
                mail_from = 'Talent Dashboard<talent-dashboard@dfrntlabs.com>'
                subject = 'Daily Recap for ' +  df.format('l, d F')
                send_mail(subject, message, mail_from, [recipient_list], fail_silently=False)
                self.stdout.write('Successfully sent Daily Digest.')
            else:
                self.stdout.write('Daily Digest has no subscribers.')
        else:
            self.stdout.write('Daily Digest had no new comments to send.')