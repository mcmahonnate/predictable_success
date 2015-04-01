from django.db import models
from django.template.loader import render_to_string
from django.core.mail import send_mail
from org.models import Employee
from django.conf import settings


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
        recipient_email = self.requester.email
        if not recipient_email:
            return
        context = {
            'recipient_full_name': self.reviewer.full_name,
            'requester_full_name': self.requester.full_name,
            'custom_message': self.message,
        }
        subject = "Someone wants your feedback!"
        plain_text_message = render_to_string('email/feedback_request_notification.txt', context)
        send_mail(subject, plain_text_message, settings.DEFAULT_FROM_EMAIL, [recipient_email])

    def __str__(self):
        return "Feedback request from %s for %s" % (self.requester, self.reviewer)


class FeedbackSubmission(models.Model):
    NOT_CONFIDENTIAL = 0
    COACH_VISIBLE = 1
    CONFIDENTIAL = 2
    CONFIDENTIALITY_CHOICES = (
        (NOT_CONFIDENTIAL, "Anyone can see it"),
        (COACH_VISIBLE, "The coach can see it but not the recipient"),
        (CONFIDENTIAL, "No one can see it; Please keep it confidential."),
    )
    feedback_request = models.ForeignKey(FeedbackRequest, null=True, blank=True, related_name='submissions')
    feedback_date = models.DateTimeField(auto_now_add=True)
    subject = models.ForeignKey(Employee, related_name='feedback_about')
    reviewer = models.ForeignKey(Employee, related_name='feedback_submissions')
    excels_at = models.TextField(blank=True)
    could_improve_on = models.TextField(blank=True)
    has_been_delivered = models.BooleanField(default=False)
    unread = models.BooleanField(default=True)
    confidentiality = models.IntegerField(choices=CONFIDENTIALITY_CHOICES, default=0)

    def was_unsolicited(self):
        if self.feedback_request is None:
            return True
        return False

    def get_reviewer_for_viewing_by_coach(self):
        if self.confidentiality <= self.COACH_VISIBLE:
            return self.reviewer
        return None

    def get_reviewer_for_viewing_by_subject(self):
        if self.confidentiality == self.NOT_CONFIDENTIAL:
            return self.reviewer
        return None

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
