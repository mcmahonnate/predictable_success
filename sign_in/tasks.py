from __future__ import absolute_import
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from predictable_success.celery import app


@app.task
def send_sign_in_link_email(sign_in_link_id):
    from sign_in.models import SignInLink
    print 'send_sign_in_link_email'
    sign_in_link = SignInLink.objects.get(id=sign_in_link_id)
    recipient_email = sign_in_link.email
    if not recipient_email:
        return
    context = {
        'sign_in_url': sign_in_link.url,
        'support_email': settings.SUPPORT_EMAIL_ADDRESS
    }
    subject = "Sign in to the Synergist"
    text_content = render_to_string('email/sign_in_link.txt', context)
    html_content = render_to_string('email/sign_in_link.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

