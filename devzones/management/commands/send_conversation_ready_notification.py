from devzones.models import Conversation
from devzones.models import EmployeeZone
from customers.models import Customer
from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.core.management.base import BaseCommand
from django.db import connection
from django.db.models import Count, F
from django.template.loader import render_to_string
from optparse import make_option
from org.models import Employee


class Command(BaseCommand):

    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return
        employee_ids = EmployeeZone.objects.get_all_drafts()
        employee_ids = employee_ids.filter(is_draft=True).exclude(employee__id=F('assessor__id')).values('assessor__id').annotate(count=Count('assessor__id'))
        print employee_ids
        for employee_id in employee_ids:
            employee = Employee.objects.get(id=employee_id['assessor__id'])
            print employee.full_name
            conversations = Conversation.objects.filter(development_lead__id=employee.id, development_lead_assessment__is_draft=True)
            if conversations.all().count() > 0:
                response_url = 'https://%s/#/id/' % tenant.domain_url
                recipient_email = employee.email
                context = {
                    'recipient': employee,
                    'conversations': conversations,
                    'response_url': response_url,
                }
                subject = "Your ID notes are ready."

                text_content = render_to_string('devzones/email/conversation_ready_notification.txt', context)
                html_content = render_to_string('devzones/email/conversation_ready_notification.html', context)
                msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
        return