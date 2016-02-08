from datetime import datetime, timedelta
from django.db import models
from org.models import Employee
from django.db.models import Q
from .tasks import send_perception_request_email


class Quality(models.Model):
    name = models.CharField(max_length=255, blank=True,)
    description = models.TextField()

    def __str__(self):
        return self.name


class QualityCluster(models.Model):
    name = models.CharField(max_length=255, blank=True,)
    min_choice = models.IntegerField(default=0)
    max_choice = models.IntegerField(default=0)
    qualities = models.ManyToManyField(Quality)

    def __str__(self):
        return self.name


def default_perception_request_expiration_date():
    return datetime.now() + timedelta(weeks=6)


class PerceptionRequestManager(models.Manager):
    def pending_for_reviewer(self, reviewer):
        return self.filter(reviewer=reviewer).filter(submission=None)

    def unanswered_for_requester(self, requester):
        return self.filter(requester=requester).filter(submission=None)

    def recent_feedback_requests_ive_sent(self, requester):
        return self.filter(requester=requester)\
            .exclude(expiration_date__lt=datetime.today())


class PerceptionRequest(models.Model):
    objects = PerceptionRequestManager()
    request_date = models.DateTimeField(auto_now_add=True)
    expiration_date = models.DateField(null=True, blank=True, default=default_perception_request_expiration_date)
    requester = models.ForeignKey(Employee, related_name='perception_requests')
    reviewer = models.ForeignKey(Employee, related_name='requests_for_perception')
    was_declined = models.BooleanField(default=False)
    was_responded_to = models.BooleanField(default=False)

    def send_notification_email(self):
        send_perception_request_email.subtask((self.id,)).apply_async()

    @property
    def expired(self):
        return not self.has_been_answered and self.expiration_date < datetime.today()

    @property
    def has_been_answered(self):
        return hasattr(self, 'submission')

    def __str__(self):
        return "Feedback request from %s for %s" % (self.requester, self.reviewer)


class PerceivedQualityManager(models.Manager):
    def self_perception(self, subject):
        return self.filter(subject=subject, reviewer=subject)

    def others_perception(self, subject):
        return self.filter(Q(subject=subject) & ~Q(reviewer=subject))

    def hidden(self, subject):
        self_perception = self.self_perception(subject).values_list('quality__id', flat=True).distinct()
        others_perception = self.others_perception(subject).values_list('quality__id', flat=True).distinct()
        hidden_ids = Quality.objects.filter(Q(id__in=self_perception) & ~Q(id__in=others_perception))\
            .values_list('id', flat=True)
        hidden = self.filter(quality__id__in=hidden_ids, subject=subject)
        return hidden

    def shared(self, subject):
        self_perception = self.self_perception(subject).values_list('quality__id', flat=True).distinct()
        others_perception = self.others_perception(subject).values_list('quality__id', flat=True).distinct()
        shared_ids = Quality.objects.filter(Q(id__in=self_perception) & Q(id__in=others_perception))\
            .values_list('id', flat=True)
        shared = self.filter(quality__id__in=shared_ids, subject=subject)
        return shared

    def blind(self, subject):
        self_perception = self.self_perception(subject).values_list('quality__id', flat=True).distinct()
        others_perception = self.others_perception(subject).values_list('quality__id', flat=True).distinct()
        blind_ids = Quality.objects.filter(~Q(id__in=self_perception) & Q(id__in=others_perception))\
            .values_list('id', flat=True)
        blind = self.filter(quality__id__in=blind_ids, subject=subject)
        return blind


class PerceivedQuality(models.Model):
    objects = PerceivedQualityManager()
    perception_request = models.ForeignKey(PerceptionRequest, null=True, blank=True, related_name='qualities')
    perception_date = models.DateTimeField(auto_now_add=True)
    subject = models.ForeignKey(Employee, related_name='+')
    reviewer = models.ForeignKey(Employee, related_name='+')
    quality = models.ForeignKey(Quality, related_name='+')
    cluster = models.ForeignKey(QualityCluster, related_name='+')

    def save(self, *args, **kwargs):
        if self.perception_request and not self.perception_request.was_responded_to:
            self.perception_request.was_responded_to = True
            self.perception_request.save()
        super(PerceivedQuality, self).save(*args, **kwargs)

    def __str__(self):
        return "%s recognizes %s for %s in %s" % (self.reviewer.full_name, self.subject.full_name, self.quality.name, self.cluster.name)


class PerceivedQualitiesReport(object):
    def __init__(self, employee):
        self.employee = employee
        self.shared_qualities = []
        self.hidden_qualities = []
        self.blind_qualities = []

    def load(self):
        self.shared_qualities = PerceivedQuality.objects.shared(self.employee)
        self.hidden_qualities = PerceivedQuality.objects.hidden(self.employee)
        self.blind_qualities = PerceivedQuality.objects.blind(self.employee)