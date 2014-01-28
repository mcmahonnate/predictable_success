from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMultiAlternatives
from datetime import datetime, timedelta
from django.utils.dateformat import DateFormat
from django.contrib.auth.models import User
from blah.models import Comment
from todo.models import Task

class Command(BaseCommand):

    def handle(self, *args, **options):
        dt = datetime.now()
        start_dt = dt-timedelta(days=7)
        comments = Comment.objects.filter(created_date__range=[start_dt,dt])
        text_content = None
        html_content = None
        for comment in comments:
            self.stdout.write(comment.content)
            if text_content is not None:
                text_content = text_content + comment.content
                html_content = html_content + "<p>" + comment.content + "</p>"
            else:
                text_content = comment.content
                html_content = comment.content
        if text_content is not None:
            recipients = User.objects.filter(groups__id=3)
            recipient_list = None
            if recipients is not None:
                for recipient in recipients:
                    if recipient_list is not None:
                        recipient_list = recipient_list + recipient.email
                    else:
                        recipient_list = recipient.email
                df = DateFormat(dt)
                from_email = 'People First<peoplefirst@dfrntlabs.com>'
                subject = 'Daily Recap for ' +  df.format('l, d F')
                msg = EmailMultiAlternatives(subject, text_content, from_email, [recipient_list])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                self.stdout.write('Successfully sent Daily Digest.')
            else:
                self.stdout.write('Daily Digest has no subscribers.')
        else:
            self.stdout.write('Daily Digest had no new comments to send.')