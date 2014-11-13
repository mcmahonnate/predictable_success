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
        comment_type = ContentType.objects.get(model="comment")
        employee_type = ContentType.objects.get(model="employee")
        team_type = ContentType.objects.get(model="team")
        start_dt = dt-timedelta(days=1)
        plaintext = get_template('daily_digest_email.txt')
        htmly = get_template('daily_digest_email.html')
        recipients = User.objects.filter(groups__id=3)
        for recipient in recipients:
            comments = Comment.objects.filter(created_date__range=[start_dt,dt])
            comments = comments.exclude(object_id=recipient.employee.id, content_type=employee_type)
            todos = Task.objects.filter(created_date__range=[start_dt,dt])
            todos = todos.exclude(employee__id=recipient.employee.id)
            if comments.count() > 0 or todos.count() > 0:
                df = DateFormat(dt)
                from_email = 'Dash<dash@dfrntlabs.com>'
                subject = 'Daily Recap for ' +  df.format('l, d F')
                site = get_current_site(None).domain
                date = df.format('l, d F')
                data = Context({ 'date': date, 'comments': comments, 'todos': todos, 'site': site, 'employee_type': employee_type, 'team_type': team_type, 'comment_type': comment_type, 'recipient': recipient})
                text_content = plaintext.render(data)
                html_content = htmly.render(data)
                msg = EmailMultiAlternatives(subject, text_content, from_email, [recipient.email])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                self.stdout.write('Successfully sent Daily Digest.')
            else:
                self.stdout.write('Daily Digest had no new comments to send.')