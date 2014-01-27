from django.core.management.base import BaseCommand, CommandError
from django.core.mail import send_mail
from datetime import datetime
from django.utils.dateformat import DateFormat

class Command(BaseCommand):

    def handle(self, *args, **options):
        dt = datetime.now()
        df = DateFormat(dt)
        mail_from = 'Talent Dashboard<talent-dashboard@dfrntlabs.com>'
        subject = 'Daily Recap for ' +  df.format('l, d F')
        send_mail(subject, 'Here is the message.', mail_from,
            ['natem@fool.com'], fail_silently=False)
        self.stdout.write('Successfully sent daily digest')