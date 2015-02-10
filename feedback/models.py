from django.db import models
from django.db.models.query import QuerySet
from org.models import Employee


class FeedbackRequestManager(models.Manager):
    def pending_for_reviewer(self, reviewer):
        return self.filter(reviewer=reviewer).filter(is_complete=False)


class FeedbackRequest(models.Model):
    objects = FeedbackRequestManager()
    request_date = models.DateTimeField(auto_now_add=True)
    expiration_date = models.DateField(null=True, blank=True)
    requester = models.ForeignKey(Employee, related_name='feedback_requests')
    reviewer = models.ForeignKey(Employee, related_name='requests_for_feedback')
    is_complete = models.BooleanField()


class FeedbackSubmission(models.Model):
    feedback_request = models.ForeignKey(FeedbackRequest, null=True, blank=True, related_name='submissions')
    feedback_date = models.DateTimeField(auto_now_add=True)
    subject = models.ForeignKey(Employee, related_name='feedback_about')
    reviewer = models.ForeignKey(Employee, related_name='feedback_submissions')
    excels_at = models.TextField(blank=True)
    could_improve_on = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if self.feedback_request:
            self.feedback_request.is_complete = True
            self.feedback_request.save()
        super(FeedbackSubmission, self).save(*args, **kwargs)
