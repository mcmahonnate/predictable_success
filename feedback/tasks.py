from __future__ import absolute_import
from talentdashboard.celery import app
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.db import connection
from customers.models import Customer

@app.task
def send_feedback_request_email(request_id):
    from feedback.models import FeedbackRequest
    feedback_request = FeedbackRequest.objects.get(id=request_id)
    recipient_email = feedback_request.reviewer.email
    if not recipient_email:
        return
    tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
    response_url = 'https://%s/#/feedback/request/%d/reply' % (tenant.domain_url, feedback_request.id)
    context = {
        'recipient_first_name': feedback_request.reviewer.first_name,
        'requester_full_name': feedback_request.requester.full_name,
        'requester_first_name': feedback_request.requester.first_name,
        'custom_message': feedback_request.message,
        'response_url': response_url,
    }
    subject = "Someone wants your feedback!"
    text_content = render_to_string('email/feedback_request_notification.txt', context)
    html_content = render_to_string('email/feedback_request_notification.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@app.task
def send_feedback_digest_email(digest_id):
    from feedback.models import FeedbackDigest
    feedback_digest = FeedbackDigest.objects.get(id=digest_id)
    recipient_email = feedback_digest.subject.email
    if not recipient_email:
        return
    tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
    digest_url = 'https://%s/#/feedback/' % (tenant.domain_url, feedback_digest.id)
    context = {
        'recipient_first_name': feedback_digest.subject.first_name,
        'delivered_by_full_name': feedback_digest.delivered_by.full_name,
        'digest_url': digest_url,
    }
    subject = "Your feedback is ready!"
    text_content = render_to_string('email/feedback_digest_notification.txt', context)
    html_content = render_to_string('email/feedback_digest_notification.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()