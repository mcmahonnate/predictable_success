from django.db import models
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from model_utils.models import TimeStampedModel
from org.models import Employee
from django.conf import settings
from django.db import connection
from django.db.models import Q
from customers.models import Customer


class FeedbackRequestManager(models.Manager):
    def pending_for_reviewer(self, reviewer):
        return self.filter(reviewer=reviewer).filter(is_complete=False)

    def unanswered_for_requester(self, requester):
        return self.filter(requester=requester).filter(submission=None)

    def ready_for_processing(self, requester):
        has_no_digest = Q(submission__feedback_digest=None)
        has_no_submission = Q(submission=None)
        return self.filter(requester=requester)\
            .filter(has_no_submission | has_no_digest)\
            .filter(was_declined=False)


class FeedbackRequest(models.Model):
    objects = FeedbackRequestManager()
    request_date = models.DateTimeField(auto_now_add=True)
    expiration_date = models.DateField(null=True, blank=True)
    requester = models.ForeignKey(Employee, related_name='feedback_requests')
    reviewer = models.ForeignKey(Employee, related_name='requests_for_feedback')
    message = models.TextField(blank=True)
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

    @property
    def has_been_answered(self):
        return hasattr(self, 'submission')

    def __str__(self):
        return "Feedback request from %s for %s" % (self.requester, self.reviewer)


class FeedbackSubmissionManager(models.Manager):
    def ready_for_processing(self, subject):
        return self.filter(subject=subject).filter(feedback_digest=None)

    def solicited_and_ready_for_processing(self, subject):
        return self.ready_for_processing(subject).exclude(feedback_request=None)

    def unsolicited_and_ready_for_processing(self, subject):
        return self.ready_for_processing(subject).filter(feedback_request=None)


class FeedbackSubmission(models.Model):
    objects = FeedbackSubmissionManager()
    feedback_request = models.OneToOneField(FeedbackRequest, null=True, blank=True, related_name='submission')
    feedback_digest = models.ForeignKey('FeedbackDigest', null=True, blank=True, related_name='submissions')
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


class FeedbackDigest(TimeStampedModel):
    subject = models.ForeignKey(Employee, related_name='+')
    coach = models.ForeignKey(Employee, related_name='+')
    summary = models.TextField(blank=True)
    has_been_delivered = models.BooleanField(default=False)


class FeedbackProgressReport(object):
    def __init__(self, employee):
        self.employee = employee
        self.unanswered_requests = []
        self.solicited_submissions = []
        self.unsolicited_submissions = []

    def load(self):
        self.unanswered_requests = FeedbackRequest.objects.unanswered_for_requester(self.employee)
        self.solicited_submissions = FeedbackSubmission.objects.solicited_and_ready_for_processing(self.employee)
        self.unsolicited_submissions = FeedbackSubmission.objects.unsolicited_and_ready_for_processing(self.employee)
