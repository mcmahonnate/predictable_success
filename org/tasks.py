from __future__ import absolute_import
from predictable_success.celery import app
from django.core.mail import EmailMultiAlternatives
from django.core.urlresolvers import reverse
from django.utils.html import strip_tags
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, force_bytes
from django.template import Context
from django.template.loader import get_template
from django.contrib.auth.models import User
import string

@app.task
def send_activation_email(user_id, customer_id):

    from customers.models import Customer
    tenant = Customer.objects.get(id=customer_id)
    user = User.objects.get(id=user_id)

    html_template = get_template('activation/activate_email.html')
    text_template = get_template('activation/activate_email.txt')
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    activation_link = "https://%s%s" % (tenant.domain_url, reverse('account_activate', kwargs={'uidb64': uid, 'token': token}))
    context = Context({
        'first_name': user.employee.first_name,
        'activation_link': activation_link,
        'message': tenant.activation_email,
    })
    from_email = 'Scoutmap<scoutmap@dfrntlabs.com>'
    subject = 'Welcome to Scoutmap'
    text_content = text_template.render(context)
    html_content = html_template.render(context)
    text_content = string.replace(text_content, '[ACTIVATION LINK]', activation_link)
    text_content = strip_tags(text_content)
    html_content = string.replace(html_content, '[ACTIVATION LINK]', activation_link)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [user.email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()