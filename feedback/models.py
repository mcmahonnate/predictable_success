from datetime import datetime, timedelta
from django.db import models
from django.utils import timezone
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
        return self.filter(reviewer=reviewer).filter(submission=None)

    def unanswered_for_requester(self, requester):
        return self.filter(requester=requester).filter(submission=None)

    def recent_feedback_requests_ive_sent(self, requester):
        return self.filter(requester=requester)\
            .exclude(expiration_date__lt=datetime.today())

    def ready_for_processing(self, requester):
        has_no_digest = Q(submission__feedback_digest=None)
        has_no_submission = Q(submission=None)
        return self.filter(requester=requester)\
            .filter(has_no_submission | has_no_digest)\
            .filter(was_declined=False)

def default_feedback_request_expiration_date():
    return datetime.now() + timedelta(weeks=6)


class FeedbackRequest(models.Model):
    objects = FeedbackRequestManager()
    request_date = models.DateTimeField(auto_now_add=True)
    expiration_date = models.DateField(null=True, blank=True, default=default_feedback_request_expiration_date)
    requester = models.ForeignKey(Employee, related_name='feedback_requests')
    reviewer = models.ForeignKey(Employee, related_name='requests_for_feedback')
    message = models.TextField(blank=True)
    was_declined = models.BooleanField(default=False)
    was_responded_to = models.BooleanField(default=False)

    def send_notification_email(self):
        recipient_email = self.reviewer.email
        if not recipient_email:
            return
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        response_url = 'https://%s/#/feedback/request/%d/reply' % (tenant.domain_url, self.id)
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
    def expired(self):
        return not self.has_been_answered and self.expiration_date < datetime.today()

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
    excels_at_summarized = models.TextField(blank=True)
    could_improve_on_summarized = models.TextField(blank=True)
    has_been_delivered = models.BooleanField(default=False)
    unread = models.BooleanField(default=True)
    anonymous = models.BooleanField(default=False)

    def was_unsolicited(self):
        if self.feedback_request is None:
            return True
        return False

    def save(self, *args, **kwargs):
        if self.feedback_request and not self.feedback_request.was_responded_to:
            self.feedback_request.was_responded_to = True
            self.feedback_request.save()
        super(FeedbackSubmission, self).save(*args, **kwargs)

    @property
    def anonymized_reviewer(self):
        if self.anonymous:
            return None
        return self.reviewer

    def __str__(self):
        return "Feedback submission by %s for %s" % (self.reviewer, self.subject)


class OnlyOneCurrentFeedbackDigestAllowed(Exception):
    pass


class FeedbackDigestManager(models.Manager):
    def get_current_delivered_for_employee(self, employee):
        return self.filter(subject=employee, has_been_delivered=True).latest('delivery_date')

    def get_all_delivered_for_employee(self, employee):
        return self.filter(subject=employee, has_been_delivered=True)

    def get_all_ive_delivered(self, employee):
        return self.filter(delivered_by=employee, has_been_delivered=True, subject__departure_date__isnull=True)


class FeedbackDigest(TimeStampedModel):
    objects = FeedbackDigestManager()
    subject = models.ForeignKey(Employee, related_name='+')
    summary = models.TextField(blank=True)
    has_been_delivered = models.BooleanField(default=False)
    delivered_by = models.ForeignKey(Employee, related_name='+', null=True)
    delivery_date = models.DateTimeField(null=True)

    def save(self, *args, **kwargs):
        if not self.has_been_delivered:
            if self.pk is None and FeedbackDigest.objects\
                    .filter(subject=self.subject)\
                    .filter(has_been_delivered=False)\
                    .exists():
                raise OnlyOneCurrentFeedbackDigestAllowed()
            elif FeedbackDigest.objects\
                    .exclude(pk=self.pk)\
                    .filter(subject=self.subject)\
                    .filter(has_been_delivered=False)\
                    .exists():
                raise OnlyOneCurrentFeedbackDigestAllowed()
        super(FeedbackDigest, self).save(*args, **kwargs)

    def deliver(self, delivered_by):
        self.delivered_by = delivered_by
        self.has_been_delivered = True
        self.delivery_date = timezone.now()
        self.submissions.all().update(has_been_delivered=True)
        self.save()

class FeedbackProgressReports(object):
    def __init__(self, coach):
        self.coach = coach
        self.progress_reports = []

    def load(self):
        employees = Employee.objects.get_current_employees_by_coach(self.coach.id)
        for employee in employees:
            progress_report = FeedbackProgressReport(employee)
            progress_report.load()
            if progress_report.unsolicited_submissions.count() > 0 or \
                progress_report.solicited_submissions.count() > 0 or \
                progress_report.unanswered_requests.count() > 0:
                self.progress_reports.append(progress_report)


class FeedbackProgressReport(object):
    def __init__(self, employee):
        self.employee = employee
        self.unanswered_requests = []
        self.solicited_submissions = []
        self.unsolicited_submissions = []
        self.recent_feedback_requests_ive_sent = []

    def load(self):
        self.unanswered_requests = FeedbackRequest.objects.unanswered_for_requester(self.employee)
        self.solicited_submissions = FeedbackSubmission.objects.solicited_and_ready_for_processing(self.employee)
        self.unsolicited_submissions = FeedbackSubmission.objects.unsolicited_and_ready_for_processing(self.employee)
        self.recent_feedback_requests_ive_sent = FeedbackRequest.objects.recent_feedback_requests_ive_sent(self.employee)
