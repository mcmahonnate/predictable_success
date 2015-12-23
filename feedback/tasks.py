from __future__ import absolute_import
from talentdashboard.celery import app
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.db import connection
from customers.models import Customer
from org.models import Employee
from datetime import datetime, timedelta

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
def send_feedback_request_reminder_email(employee_id, customer_id):

    from customers.models import Customer
    tenant = Customer.objects.get(id=customer_id)

    from org.models import Employee
    employee = Employee.objects.get(id=employee_id)
    recipient_email = employee.user.email

    from feedback.models import FeedbackRequest
    feedback_requests = FeedbackRequest.objects.pending_for_reviewer(reviewer=employee)

    domain_url = 'https://%s/#' % (tenant.domain_url)
    context = {
        'recipient': employee,
        'feedback_requests': feedback_requests,
        'feedback_request_count': feedback_requests.count(),
        'domain_url': domain_url,
    }
    subject = "Don't forget! You have %s %s waiting for your feedback!" % (feedback_requests.count(), ('people' if feedback_requests.count() > 1 else 'person'))
    text_content = render_to_string('email/feedback_request_reminder_email.txt', context)
    html_content = render_to_string('email/feedback_request_reminder_email.html', context)
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
    digest_url = 'https://%s/#/feedback/%s' % (tenant.domain_url, feedback_digest.id)
    context = {
        'recipient_first_name': feedback_digest.subject.first_name,
        'delivered_by_full_name': feedback_digest.delivered_by.full_name,
        'digest_url': digest_url,
    }
    subject = "Your feedback is ready"
    text_content = render_to_string('email/feedback_digest_notification.txt', context)
    html_content = render_to_string('email/feedback_digest_notification.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@app.task
def send_share_feedback_digest_email(digest_id, employee_id):
    from feedback.models import FeedbackDigest
    feedback_digest = FeedbackDigest.objects.get(id=digest_id)
    employee = Employee.objects.get(id=employee_id)
    recipient_email = employee.email
    customer = Customer.objects.filter(schema_name=connection.schema_name).first()
    excels_at_question = customer.feedback_excels_at_question
    could_improve_on_question = customer.feedback_could_improve_on_question

    if not employee:
        return

    context = {
        'recipient': employee,
        'digest': feedback_digest,
        'excels_at_question': excels_at_question,
        'could_improve_on_question': could_improve_on_question,
    }

    subject = "%s has shared their feedback with you" % feedback_digest.subject.full_name
    text_content = render_to_string('email/share_feedback_digest.txt', context)
    html_content = render_to_string('email/share_feedback_digest.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@app.task
def send_feedback_was_helpful_email(employee_id, helpful_count, days_ago):
    from org.models import Employee
    employee = Employee.objects.get(id=employee_id)
    recipient_email = employee.email
    if not recipient_email:
        return
    date_now = datetime.now()
    date_days_ago = date_now - timedelta(days=int(days_ago))
    helpful_submissions = employee.helpful_feedback_given
    helpful_submissions = helpful_submissions.filter(date__range=[date_days_ago, date_now])

    tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
    feedback_url = 'https://%s/#/feedback/submission/' % tenant.domain_url
    context = {
        'recipient_first_name': employee.first_name,
        'feedback_url': feedback_url,
        'helpful_count': helpful_count,
        'helpful_submissions': helpful_submissions,
        'days_ago': days_ago
    }
    if helpful_count > 1:
        subject = '%s people thought your feedback was helpful' % helpful_count
    else:
        subject = '%s person thought your feedback was helpful' % helpful_count
    text_content = render_to_string('email/feedback_was_helpful_notification.txt', context)
    html_content = render_to_string('email/feedback_was_helpful_notification.html', context)
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()