from __future__ import absolute_import
from talentdashboard.celery import app
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.db import connection
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