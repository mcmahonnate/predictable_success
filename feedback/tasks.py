from __future__ import absolute_import
from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import send_mail
from celery import shared_task


@shared_task
def send_feedback_request_email(feedback_request):
    recipient_email = feedback_request.requester.email
    if not recipient_email:
        return
    context = {
        'recipient_full_name': feedback_request.reviewer.full_name,
        'requester_full_name': feedback_request.requester.full_name,
        'custom_message': feedback_request.message,
    }
    subject = "Someone wants your feedback!"
    plain_text_message = render_to_string('email/feedback_request_notification.txt', context)
    send_mail(subject, plain_text_message, settings.DEFAULT_FROM_EMAIL, [recipient_email])
