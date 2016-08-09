from __future__ import absolute_import
from predictable_success.celery import app
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
        'category': perception_request.category.name,
        'response_url': response_url,
    }
    subject = "Someone needs your quick input"
    text_content = render_to_string('qualities/email/perception_request_notification.txt', context)
    html_content = render_to_string('qualities/email/perception_request_notification.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@app.task
def send_you_have_been_recognized_email(cluster_id, subject_id, reviewer_id):
    from qualities.models import QualityCluster
    from org.models import Employee
    quality_cluster = QualityCluster.objects.get(id=cluster_id)
    subject = Employee.objects.get(id=subject_id)
    reviewer = Employee.objects.get(id=reviewer_id)
    recipient_email = subject.email
    if not recipient_email:
        return
    tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
    response_url = 'https://%s/#/qualities/perception/my' % tenant.domain_url
    context = {
        'recipient_first_name': subject.first_name,
        'reviewer_full_name': reviewer.full_name,
        'category': quality_cluster.name,
        'response_url': response_url,
    }
    subject = "You've been recognized!"
    text_content = render_to_string('qualities/email/you_have_been_recognized_email.txt', context)
    html_content = render_to_string('qualities/email/you_have_been_recognized_email.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()