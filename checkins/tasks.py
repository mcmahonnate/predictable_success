from __future__ import absolute_import
from talentdashboard.celery import app
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.db import connection
from customers.models import Customer
from org.models import Employee


@app.task
def send_host_sent_employee_checkin_notification(checkin_id):
    from checkins.models import CheckIn
    checkin = CheckIn.objects.get(id=checkin_id)
    recipient_email = checkin.employee.email
    if not recipient_email:
        return
    tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
    response_url = 'https://%s/#/checkins/%d' % (tenant.domain_url, checkin.id)
    context = {
        'recipient_first_name': checkin.employee.first_name,
        'host_full_name': checkin.host.full_name,
        'response_url': response_url,
    }
    subject = "Here are the notes from your check-in with %s" % checkin.host.full_name
    text_content = render_to_string('checkins/email/checkin_approve_notification.txt', context)
    html_content = render_to_string('checkins/email/checkin_approve_notification.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@app.task
def send_employee_shared_checkin_notification(checkin_id):
    from checkins.models import CheckIn
    checkin = CheckIn.objects.get(id=checkin_id)
    recipient_email = checkin.host.email
    if not recipient_email:
        return
    tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
    response_url = 'https://%s/#/checkins/%d' % (tenant.domain_url, checkin.id)
    context = {
        'recipient_first_name': checkin.host.first_name,
        'employee_full_name': checkin.employee.full_name,
        'response_url': response_url,
    }
    subject = "%s shared their notes with leadership" % checkin.employee.full_name
    text_content = render_to_string('checkins/email/checkin_share_notification.txt', context)
    html_content = render_to_string('checkins/email/checkin_share_notification.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@app.task
def send_checkin_request_notification(checkin_request_id):
    from checkins.models import CheckInRequest
    checkin_request = CheckInRequest.objects.get(id=checkin_request_id)
    recipient_email = checkin_request.host.email
    if not recipient_email:
        return
    tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
    response_url = 'https://%s/#/checkin/%d' % (tenant.domain_url, checkin_request.requester.id)
    context = {
        'recipient_first_name': checkin_request.host.first_name,
        'employee_first_name': checkin_request.requester.first_name,
        'employee_full_name': checkin_request.requester.full_name,
        'response_url': response_url,
    }
    subject = "%s has requested a check in with you" % checkin_request.requester.full_name
    text_content = render_to_string('checkins/email/checkin_request_notification.txt', context)
    html_content = render_to_string('checkins/email/checkin_request_notification.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()