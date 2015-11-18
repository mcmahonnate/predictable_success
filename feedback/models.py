from datetime import datetime, timedelta
from django.db import models, connection
from django.utils import timezone
from model_utils.models import TimeStampedModel
from org.models import Employee
from django.db.models import Q
from itertools import chain, groupby
from .tasks import send_feedback_request_email


class FeedbackRequestManager(models.Manager):
    def pending_for_reviewer(self, reviewer):
        return self.filter(reviewer=reviewer).filter(submission=None)

    def unanswered_for_requester(self, requester):
        return self.filter(requester=requester).filter(submission=None)

    def recent_feedback_requests_ive_sent(self, requester):
        return self.filter(requester=requester)\
            .exclude(expiration_date__lt=datetime.today())

    def recent_feedback_requests_ive_sent_that_have_not_been_delivered(self, requester):
        return self.filter(requester=requester)\
            .exclude(expiration_date__lt=datetime.today())\
            .filter(Q(was_responded_to=False) | (Q(was_responded_to=True) & Q(submission__has_been_delivered=False)))\

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
        send_feedback_request_email.subtask((self.id,)).apply_async()

    @property
    def expired(self):
        return not self.has_been_answered and self.expiration_date < datetime.today()

    @property
    def has_been_answered(self):
        return hasattr(self, 'submission')

    def __str__(self):
        return "Feedback request from %s for %s" % (self.requester, self.reviewer)


class FeedbackSubmissionManager(models.Manager):
    def submitted_not_delivered(self, reviewer):
        return self.filter(reviewer=reviewer).filter(has_been_delivered=False)

    def received_not_delivered(self, subject):
        return self.filter(subject=subject).filter(has_been_delivered=False)

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

    def __str__(self):
        return "Feedback Digest for %s delivered by %s" % (self.subject, self.delivered_by)

class FeedbackProgressReports(object):
    def __init__(self, coach):
        self.coach = coach
        self.progress_reports = []

    def load(self):
        employees = Employee.objects.get_current_employees_by_coach(self.coach.id)
        for employee in employees:
            progress_report = FeedbackProgressReport(employee)
            progress_report.load()
            if progress_report.all_submissions_not_delivered.count() > 0:
                self.progress_reports.append(progress_report)


class FeedbackProgressReport(object):
    def __init__(self, employee):
        self.employee = employee
        self.unanswered_requests = []
        self.solicited_submissions = []
        self.unsolicited_submissions = []
        self.recent_feedback_requests_ive_sent = []
        self.all_submissions_not_delivered = []

    def load(self):
        self.unanswered_requests = FeedbackRequest.objects.unanswered_for_requester(self.employee)
        self.solicited_submissions = FeedbackSubmission.objects.solicited_and_ready_for_processing(self.employee)
        self.unsolicited_submissions = FeedbackSubmission.objects.unsolicited_and_ready_for_processing(self.employee)
        self.recent_feedback_requests_ive_sent = FeedbackRequest.objects.recent_feedback_requests_ive_sent_that_have_not_been_delivered(self.employee)
        self.all_submissions_not_delivered = FeedbackSubmission.objects.received_not_delivered(self.employee)


class EmployeeFeedbackReports(object):
    def __init__(self, object):
        self.employee_report = []
        self.start_date = object.get('start_date', datetime.today() - timedelta(days=365))
        self.end_date = object.get('end_date', datetime.today())

    def load(self):
        def dictfetchall(cursor):
            "Return all rows from a cursor as a dict"
            columns = [col[0] for col in cursor.description]
            return [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
        cursor = connection.cursor()
        cursor.execute("SELECT requester_id as employee_id, count(requester_id) as total_i_requested FROM feedback_feedbackrequest WHERE (request_date >= '%s' AND request_date <= '%s') GROUP BY requester_id" % (self.start_date, self.end_date))
        total_i_requested = dictfetchall(cursor)
        cursor.execute("SELECT reviewer_id as employee_id, count(reviewer_id) as total_requested_of_me FROM feedback_feedbackrequest WHERE (request_date >= '%s' AND request_date <= '%s') GROUP BY reviewer_id" % (self.start_date, self.end_date))
        total_requested_of_me = dictfetchall(cursor)
        cursor.execute("SELECT reviewer_id as employee_id, count(reviewer_id) as total_i_responded_to FROM feedback_feedbacksubmission WHERE feedback_request_id IS NOT NULL AND (feedback_date >= '%s' AND feedback_date <= '%s') GROUP BY reviewer_id" % (self.start_date, self.end_date))
        total_i_responded_to = dictfetchall(cursor)
        cursor.execute("SELECT subject_id as employee_id, count(subject_id) as total_responded_to_me FROM feedback_feedbacksubmission WHERE feedback_request_id IS NOT NULL AND (feedback_date >= '%s' AND feedback_date <= '%s') GROUP BY subject_id" % (self.start_date, self.end_date))
        total_responded_to_me = dictfetchall(cursor)
        cursor.execute("SELECT reviewer_id as employee_id, count(reviewer_id) as total_unrequested_i_gave FROM feedback_feedbacksubmission WHERE feedback_request_id IS NULL AND (feedback_date >= '%s' AND feedback_date <= '%s') GROUP BY reviewer_id" % (self.start_date, self.end_date))
        total_unrequested_i_gave = dictfetchall(cursor)
        cursor.execute("SELECT subject_id as employee_id, count(subject_id) as total_unrequested_given_to_me FROM feedback_feedbacksubmission WHERE feedback_request_id IS NULL AND (feedback_date >= '%s' AND feedback_date <= '%s') GROUP BY subject_id" % (self.start_date, self.end_date))
        total_unrequested_given_to_me = dictfetchall(cursor)
        cursor.execute("SELECT delivered_by_id as employee_id, count(delivered_by_id) as total_digests_i_delivered FROM feedback_feedbackdigest WHERE has_been_delivered=TRUE AND (delivery_date >= '%s' AND delivery_date <= '%s') GROUP BY delivered_by_id" % (self.start_date, self.end_date))
        total_digests_i_delivered = dictfetchall(cursor)
        cursor.execute("SELECT subject_id as employee_id, count(subject_id) as total_digests_i_received FROM feedback_feedbackdigest WHERE has_been_delivered=TRUE AND (delivery_date >= '%s' AND delivery_date <= '%s') GROUP BY subject_id" % (self.start_date, self.end_date))
        total_digests_i_received = dictfetchall(cursor)

        lst = sorted(chain(total_i_requested,total_requested_of_me,total_i_responded_to,total_responded_to_me,total_unrequested_i_gave,total_unrequested_given_to_me,total_digests_i_delivered,total_digests_i_received), key=lambda x:x['employee_id'])
        for k,v in groupby(lst, key=lambda x:x['employee_id']):
            d = {}
            for dct in v:
                d.update(dct)
            self.employee_report.append(EmployeeFeedbackReport(d))


class EmployeeFeedbackReport(object):
    def __init__(self, object):
        employee_id = object['employee_id']
        self.employee = Employee.objects.get(pk=employee_id)
        self.total_i_requested = object.get('total_i_requested', 0)
        self.total_requested_of_me = object.get('total_requested_of_me', 0)
        self.total_i_responded_to = object.get('total_i_responded_to', 0)
        self.total_responded_to_me = object.get('total_responded_to_me', 0)
        self.total_unrequested_i_gave = object.get('total_unrequested_i_gave', 0)
        self.total_unrequested_given_to_me = object.get('total_unrequested_given_to_me', 0)
        self.total_digests_i_received = object.get('total_digests_i_received', 0)
        self.total_digests_i_delivered = object.get('total_digests_i_delivered', 0)