from __future__ import absolute_import
from talentdashboard.celery import app
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.db import connection
from customers.models import Customer

@app.task
def send_perception_request_email(request_id):
    from qualities.models import PerceptionRequest
    perception_request = PerceptionRequest.objects.get(id=request_id)
    recipient_email = perception_request.reviewer.email
    if not recipient_email:
        return
    tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
    response_url = 'https://%s/#/qualities/perception/request/%d/reply' % (tenant.domain_url, perception_request.id)
    context = {
        'recipient_first_name': perception_request.reviewer.first_name,
        'requester_full_name': perception_request.requester.full_name,
        'custom_message': perception_request.message,
        'response_url': response_url,
    }
    subject = "Someone wants your feedback!"
    text_content = render_to_string('email/perception_request_notification.txt', context)
    html_content = render_to_string('email/perception_request_notification.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()
