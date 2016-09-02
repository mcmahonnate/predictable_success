from __future__ import absolute_import
from customers.models import Customer
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.core.signing import Signer
from django.db import connection
from django.template.loader import render_to_string
from predictable_success.celery import app


@app.task
def send_leadership_style_request_email(request_id):
    from leadership_styles.models import LeadershipStyleRequest
    print 'send_notification_email task'
    tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
    leadership_style_request = LeadershipStyleRequest.objects.get(id=request_id)
    if leadership_style_request.reviewer is None:
        signer = Signer()
        recipient_email = leadership_style_request.reviewer_email
        recipient_first_name = None
        response_url = tenant.build_url("/360/request/%s" % signer.sign(request_id))
    else:
        recipient_email = leadership_style_request.reviewer.email
        recipient_first_name = leadership_style_request.reviewer.first_name
        response_url = tenant.build_url("/#/leadership-style/request/%d/reply" % leadership_style_request.id)
    if not recipient_email:
        return

    context = {
        'recipient_first_name': recipient_first_name,
        'requester_full_name': leadership_style_request.requester.full_name,
        'requester_first_name': leadership_style_request.requester.first_name,
        'custom_message': leadership_style_request.message,
        'response_url': response_url,
    }
    subject = "%s needs some quick input from you" % leadership_style_request.requester.full_name
    text_content = render_to_string('email/leadership_style_request_notification.txt', context)
    html_content = render_to_string('email/leadership_style_request_notification.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@app.task
def send_quiz_link_email(quiz_link_id):
    from leadership_styles.models import QuizUrl
    print 'send_quiz_link_email'
    quiz = QuizUrl.objects.get(id=quiz_link_id)
    recipient_email = quiz.email
    if not recipient_email:
        return
    context = {
        'quiz_url': quiz.url,
    }
    subject = "Here's your personalized link"
    text_content = render_to_string('email/quiz_link.txt', context)
    html_content = render_to_string('email/quiz_link.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

