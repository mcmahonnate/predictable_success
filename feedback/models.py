from django.db import models
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from org.models import Employee
from django.conf import settings
from django.db import connection
from customers.models import Customer


class FeedbackRequestManager(models.Manager):
    def pending_for_reviewer(self, reviewer):
        return self.filter(reviewer=reviewer).filter(is_complete=False)

    def pending_for_requester(self, requester):
        return self.filter(requester=requester).filter(is_complete=False)


class FeedbackRequest(models.Model):
    objects = FeedbackRequestManager()
    request_date = models.DateTimeField(auto_now_add=True)
    expiration_date = models.DateField(null=True, blank=True)
    requester = models.ForeignKey(Employee, related_name='feedback_requests')
    reviewer = models.ForeignKey(Employee, related_name='requests_for_feedback')
    message = models.TextField(blank=True)
    is_complete = models.BooleanField(default=False)
    was_declined = models.BooleanField(default=False)

    def send_notification_email(self):
        recipient_email = self.reviewer.email
        if not recipient_email:
            return
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        response_url = 'https://%s/#/feedback/submission/%d' % (tenant.domain_url, self.id)
        context = {
            'recipient_first_name': self.reviewer.first_name,
            'requester_full_name': self.requester.full_name,
            'custom_message': self.message,
            'response_url': response_url,
        }
        subject = "Someone wants your feedback!"
        text_content = render_to_string('email/feedback_request_notification.txt', context)
        html_content = render_to_string('email/feedback_request_notification.html', context)
        msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()

    def __str__(self):
        return "Feedback request from %s for %s" % (self.requester, self.reviewer)

class FeedbackSubmissionManager(models.Manager):
    def for_subject(self, subject):
        return self.filter(subject=subject).filter(has_been_delivered=False)

class FeedbackSubmission(models.Model):
    objects = FeedbackSubmissionManager()
    feedback_request = models.ForeignKey(FeedbackRequest, null=True, blank=True, related_name='submissions')
    feedback_date = models.DateTimeField(auto_now_add=True)
    subject = models.ForeignKey(Employee, related_name='feedback_about')
    reviewer = models.ForeignKey(Employee, related_name='feedback_submissions')
    excels_at = models.TextField(blank=True)
    could_improve_on = models.TextField(blank=True)
    has_been_delivered = models.BooleanField(default=False)
    unread = models.BooleanField(default=True)
    anonymous = models.BooleanField(default=False)

    def was_unsolicited(self):
        if self.feedback_request is None:
            return True
        return False

    def save(self, *args, **kwargs):
        if self.feedback_request:
            self.feedback_request.is_complete = True
            self.feedback_request.save()
        super(FeedbackSubmission, self).save(*args, **kwargs)

    def __str__(self):
        return "Feedback submission by %s for %s" % (self.reviewer, self.subject)


class UndeliveredFeedbackReport:
    def __init__(self, employee):
        self.employee = employee
        self.undelivered_feedback = employee.feedback_about\
            .filter(has_been_delivered=False)\
            .count()


class CoacheeFeedbackReport:
    def __init__(self, employee):
        self.employee = employee
        self.feedback = employee.feedback_about\
            .order_by('-feedback_date')\
            .all()
