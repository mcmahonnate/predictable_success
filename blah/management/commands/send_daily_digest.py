from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMultiAlternatives
from datetime import datetime, timedelta
from django.utils.dateformat import DateFormat
from django.contrib.auth.models import User
from django.template.loader import get_template
from django.template import Context
from django.contrib.sites.models import get_current_site
from django.contrib.contenttypes.models import ContentType
from blah.models import Comment
from todo.models import Task

class Command(BaseCommand):

    def handle(self, *args, **options):
        dt = datetime.now()
        start_dt = dt-timedelta(days=7)
        comments = Comment.objects.filter(created_date__range=[start_dt,dt])
        todos = Task.objects.filter(created_date__range=[start_dt,dt])
        plaintext = get_template('daily_digest_email.txt')
        htmly = get_template('daily_digest_email.html')
        if comments.count > 0 or todos.count > 0:
            recipients = User.objects.filter(groups__id=3)
            recipient_list = []
            if recipients is not None:
                for recipient in recipients:
                    self.stdout.write('appending:' + recipient.email)
                    recipient_list += [recipient.email]
                df = DateFormat(dt)
                from_email = 'Dash<dash@dfrntlabs.com>'
                subject = 'Daily Recap for ' +  df.format('l, d F')
                site = get_current_site(None).domain
                date = df.format('l, d F')
                comment_type = ContentType.objects.get(model="comment")
                data = Context({ 'date': date, 'comments': comments, 'todos': todos, 'site': site, 'comment_type': comment_type })
                text_content = plaintext.render(data)
                html_content = htmly.render(data)
                msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                self.stdout.write('Successfully sent Daily Digest.')
            else:
                self.stdout.write('Daily Digest has no subscribers.')
        else:
            self.stdout.write('Daily Digest had no new comments to send.')