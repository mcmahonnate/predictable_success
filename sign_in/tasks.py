from __future__ import absolute_import
from customers.models import Customer
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db import connection
from django.template.loader import render_to_string
from django.core.urlresolvers import reverse
from predictable_success.celery import app


@app.task
def send_sign_in_link_email(sign_in_link_id):
    from sign_in.models import SignInLink
    from org.models import Employee

    print 'send_sign_in_link_email'
    sign_in_link = SignInLink.objects.get(id=sign_in_link_id)
    recipient_email = sign_in_link.email
    if not recipient_email:
        return
    context = {
        'sign_in_url': sign_in_link.url,
        'support_email': settings.SUPPORT_EMAIL_ADDRESS
    }
    try:
        employee = Employee.objects.get(email=recipient_email)
        if employee.first_name:
            context['employee_first_name'] = employee.first_name
    except Employee.DoesNotExist:
        pass
    subject = "Sign in to Find Your Fool"
    text_content = render_to_string('email/sign_in_link.txt', context)
    html_content = render_to_string('email/sign_in_link.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@app.task
def send_account_created_link_email(employee_id):
    from org.models import Employee
    print 'send_account_created_link_email'
    tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
    employee = Employee.objects.get(id=employee_id)
    recipient_email = employee.email
    findyourfool_url = tenant.build_url(reverse('index'))
    signin_url = tenant.build_url(reverse('login'))
    if not recipient_email:
        return
    context = {
        'employee_first_name': employee.first_name,
        'employee_email': employee.email,
        'support_email': settings.SUPPORT_EMAIL_ADDRESS,
        'findyourfool_url': findyourfool_url,
        'signin_url': signin_url,
    }
    subject = "We created an account for you"
    text_content = render_to_string('email/account_created.txt', context)
    html_content = render_to_string('email/account_created.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

