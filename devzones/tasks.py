from __future__ import absolute_import
from talentdashboard.celery import app
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.db import connection
from django.template import Context, Template
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from customers.models import Customer


@app.task
def send_conversation_shared_notification(conversation_id):
    from devzones.models import Conversation
    conversation = Conversation.objects.get(id=conversation_id)
    recipient_email = conversation.employee.email
    if not recipient_email:
        return
    tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
    response_url = 'https://%s/#/id/%d' % (tenant.domain_url, conversation.id)
    context = {
        'recipient_first_name': conversation.employee.first_name,
        'leader_first_name': conversation.development_lead.first_name,
        'leader_full_name': conversation.development_lead.full_name,
        'response_url': response_url,
    }
    subject = "%s shared notes from your development conversation with you." % conversation.development_lead.full_name
    text_content = render_to_string('devzones/email/conversation_shared_notification.txt', context)
    html_content = render_to_string('devzones/email/conversation_shared_notification.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@app.task
def send_selfie_notification(selfie_id):
    from devzones.models import EmployeeZone
    employee_zone = EmployeeZone.objects.get(id=selfie_id)
    recipient_email = employee_zone.employee.email
    if not recipient_email:
        return
    tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
    response_url = 'https://%s/#/id/' % tenant.domain_url
    context = {
        'recipient_first_name': employee_zone.employee.first_name,
        'response_url': response_url,
    }
    message_template = Template(tenant.devzone_selfie_email_body)
    message_body = message_template.render(Context(context))
    context['message_body'] = message_body
    subject = tenant.devzone_selfie_email_subject
    html_content = render_to_string('devzones/email/send_selfie_notification.html', context)
    text_content = strip_tags(message_body)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()