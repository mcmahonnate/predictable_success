from activity.models import Event
from customers.models import Customer
from datetime import datetime, timedelta
from django.contrib.auth.models import User, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand
from django.core.mail import EmailMultiAlternatives
from django.db import connection
from django.db.models import Q
from django.template import Context
from django.template.loader import get_template
from django.utils.dateformat import DateFormat

class Command(BaseCommand):
    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return
        ContentType.objects.clear_cache()

        # Get Daily Digest subscribers
        content_type = ContentType.objects.get_for_model(Event)
        perm = Permission.objects.get(content_type=content_type, codename='receive_daily_digest')
        recipients = User.objects.filter(Q(groups__permissions=perm) | Q(user_permissions=perm)).distinct()

        dt = datetime.now()
        start_dt = dt-timedelta(days=1)
        plaintext = get_template('email/daily_digest_email.txt')
        htmly = get_template('email/daily_digest_email.html')
        checkin_type = ContentType.objects.get(model="checkin")
        comment_type = ContentType.objects.get(model="comment")
        employeezone_type = ContentType.objects.get(model="employeezone")
        feedbackdigest_type = ContentType.objects.get(model="feedbackdigest")

        for recipient in recipients:
            # Get past days worth of activity items subscriber is allowed to see
            events = Event.objects.get_events_for_all_employees(requester=recipient)
            events = events.filter(date__range=[start_dt,dt])
            if events.count() > 0:
                df = DateFormat(dt)
                from_email = 'Scoutmap<scoutmap@dfrntlabs.com>'
                subject = 'Daily Recap for ' + df.format('l, d F')
                date = df.format('l, d F')
                data = Context(
                    {
                        'date': date,
                        'events': events,
                        'site': tenant.domain_url,
                        'checkin_type': checkin_type,
                        'comment_type': comment_type,
                        'employeezone_type': employeezone_type,
                        'feedbackdigest_type': feedbackdigest_type,
                        'recipient': recipient
                    }
                )
                text_content = plaintext.render(data)
                html_content = htmly.render(data)
                msg = EmailMultiAlternatives(subject, text_content, from_email, [recipient.email])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                self.stdout.write('Successfully sent Daily Digest.')
            else:
                self.stdout.write('Daily Digest had no new comments to send.')

