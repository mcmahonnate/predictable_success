from django.db import models
from django.db.models.query import QuerySet
from org.models import Employee


class FeedbackRequest(models.Model):
    request_date = models.DateTimeField(auto_now_add=True)
    expiration_date = models.DateField(null=True, blank=True)
    requester = models.ForeignKey(Employee, related_name='feedback_requests')
    reviewer = models.ForeignKey(Employee, related_name='requests_for_feedback')
    response = models.ForeignKey('FeedbackSubmission', null=True, blank=True)
    is_complete = models.BooleanField()


class FeedbackSubmission(models.Model):
    feedback_date = models.DateTimeField()
    subject = models.ForeignKey(Employee, related_name='feedback_about')
    reviewer = models.ForeignKey(Employee, related_name='feedback_submissions')
    excels_at = models.TextField(blank=True)
    could_improve_on = models.TextField(blank=True)


