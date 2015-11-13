from django.core.management.base import BaseCommand
from django.db import connection
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from optparse import make_option
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, force_bytes
from django.template import Context
from django.template.loader import get_template
from customers.models import Customer


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
            help='The uid of the account to activate'),
    )

    def handle(self, *args, **options):
        if connection.schema_name == options['schema_name']:
            tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
            user_id = options['user_id']
            user = User.objects.get(id=user_id)
            if user.employee is not None and user.employee.departure_date is None:
                user.is_active = True
                user.save()
                html_template = get_template('activation/activate_email.html')
                text_template = get_template('activation/activate_email.txt')
                context = Context({
                    'token': default_token_generator.make_token(user),
                    'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                    'user': user,
                    'message': tenant.activation_email,
                    'site': tenant.domain_url,
                })
                from_email = 'Scoutmap<scoutmap@dfrntlabs.com>'
                subject = 'Welcome to Scoutmap'
                text_content = text_template.render(context)
                html_content = html_template.render(context)
                msg = EmailMultiAlternatives(subject, text_content, from_email, [user.email])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                print user.email
        return