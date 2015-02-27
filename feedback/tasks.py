from __future__ import absolute_import
from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import send_mail
from celery import shared_task


@shared_task
def send_feedback_request_email(feedback_request):
    recipient_email = feedback_request.reviewer.email
    if not recipient_email:
        return
    response_url_params = {
        'scheme': 'http',
        'host': 'localhost',
        'id': feedback_request.id,
    }
    response_url_template = settings.FEEDBACK_APP_SETTINGS['respond_to_feedback_request_url_template']
    response_url = response_url_template.format(**response_url_params)

    context = {
        'recipient_full_name': feedback_request.reviewer.full_name,
        'requester_full_name': feedback_request.requester.full_name,
        'custom_message': feedback_request.message,
        'response_url': response_url,
    }
    subject = "Someone wants your feedback!"
    plain_text_message = render_to_string('email/feedback_request_notification.txt', context)
    send_mail(subject, plain_text_message, settings.DEFAULT_FROM_EMAIL, [recipient_email])
