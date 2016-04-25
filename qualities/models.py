from datetime import datetime, timedelta
from django.db import models
from org.models import Employee
from django.db.models import Q, Count
from .tasks import send_perception_request_email


class Quality(models.Model):
    name = models.CharField(max_length=255, blank=True,)
    description = models.TextField()

    def __str__(self):
        return self.name


class QualityClusterManager(models.Manager):
    def need_self_assessment(self, employee):
        self_perceptions = PerceivedQuality.objects.self_perception(subject=employee)
        self_cluster_ids = self_perceptions.values_list('cluster__id', flat=True).distinct()
        blind_perceptions = PerceivedQuality.objects.blind(subject=employee)
        blind_cluster_ids = blind_perceptions.values_list('cluster__id', flat=True).distinct()

        return self.filter(id__in=blind_cluster_ids).exclude(id__in=self_cluster_ids)


class QualityCluster(models.Model):
    objects = QualityClusterManager()
    name = models.CharField(max_length=255, blank=True,)
    min_choice = models.IntegerField(default=0)
    max_choice = models.IntegerField(default=0)
    qualities = models.ManyToManyField(Quality, related_name='clusters')

    def __str__(self):
        return self.name


def default_perception_request_expiration_date():
    return datetime.now() + timedelta(weeks=6)


class PerceptionRequestManager(models.Manager):
    def pending_for_reviewer(self, reviewer):
        return self.filter(reviewer=reviewer).filter(submission=None)

    def unanswered_for_requester(self, requester):
        return self.filter(requester=requester).filter(submission=None)

    def recent_perception_requests_ive_sent(self, requester):
        return self.filter(requester=requester)\
            .exclude(expiration_date__lt=datetime.today())

    def recent_perception_requests_ive_sent_that_have_not_been_completed(self, requester):
        requests = self.recent_perception_requests_ive_sent(requester)
        return requests.filter(was_responded_to=False)


class PerceptionRequest(models.Model):
    objects = PerceptionRequestManager()
    category = models.ForeignKey(QualityCluster, null=True)
    expiration_date = models.DateField(null=True, blank=True, default=default_perception_request_expiration_date)
    message = models.TextField(blank=True)
    requester = models.ForeignKey(Employee, related_name='perception_requests')
    request_date = models.DateTimeField(auto_now_add=True)
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
        return "Perception request from %s for %s" % (self.requester, self.reviewer)


class PerceivedQualityManager(models.Manager):
    def self_perception(self, subject, exclude_clusters=[]):
        return self.filter(subject=subject, reviewer=subject).exclude(cluster__id__in=exclude_clusters)

    def others_perception(self, subject, exclude_clusters=[]):
        return self.filter(Q(subject=subject) & ~Q(reviewer=subject)).exclude(cluster__id__in=exclude_clusters)

    def all(self, subject, exclude_clusters=[]):
        all = self.filter(subject=subject).exclude(cluster__id__in=exclude_clusters)
        return all

    def hidden(self, subject, exclude_clusters=[]):
        self_perception = self.self_perception(subject, exclude_clusters).values_list('quality__id', flat=True).distinct()
        others_perception = self.others_perception(subject, exclude_clusters).values_list('quality__id', flat=True).distinct()
        hidden_ids = Quality.objects.filter(Q(id__in=self_perception) & ~Q(id__in=others_perception))\
            .values_list('id', flat=True)
        hidden = self.filter(quality__id__in=hidden_ids, subject=subject)
        return hidden

    def shared(self, subject, exclude_clusters=[]):
        self_perception = self.self_perception(subject, exclude_clusters).values_list('quality__id', flat=True).distinct()
        others_perception = self.others_perception(subject, exclude_clusters).values_list('quality__id', flat=True).distinct()
        shared_ids = Quality.objects.filter(Q(id__in=self_perception) & Q(id__in=others_perception))\
            .values_list('id', flat=True)
        shared = self.filter(quality__id__in=shared_ids, subject=subject)
        return shared

    def blind(self, subject, exclude_clusters=[]):
        self_perception = self.self_perception(subject, exclude_clusters).values_list('quality__id', flat=True).distinct()
        others_perception = self.others_perception(subject, exclude_clusters).values_list('quality__id', flat=True).distinct()
        blind_ids = Quality.objects.filter(~Q(id__in=self_perception) & Q(id__in=others_perception))\
            .values_list('id', flat=True)
        blind = self.filter(quality__id__in=blind_ids, subject=subject)
        return blind


class PerceivedQuality(models.Model):
    objects = PerceivedQualityManager()
    perception_request = models.ForeignKey(PerceptionRequest, null=True, blank=True, related_name='submission')
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


class PerceivedQualitiesReportItem(object):
    def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description
        self.type = None
        self.count = 0
        self.perceptions = [];


class PerceivedQualitiesReport(object):
    def __init__(self, employee):
        self.employee = employee
        self.qualities = []
        self.prompts = []

    def load(self):
        self.prompts = QualityCluster.objects.need_self_assessment(employee=self.employee)
        exclude_clusters = self.prompts.values_list('id', flat=True)
        shared_qualities = PerceivedQuality.objects.shared(subject=self.employee, exclude_clusters=exclude_clusters)
        hidden_qualities = PerceivedQuality.objects.hidden(subject=self.employee, exclude_clusters=exclude_clusters)
        blind_qualities = PerceivedQuality.objects.blind(subject=self.employee, exclude_clusters=exclude_clusters)
        all_quality_ids = PerceivedQuality.objects.all(subject=self.employee, exclude_clusters=exclude_clusters).values_list('quality__id', flat=True).distinct()
        qualities = Quality.objects.filter(id__in=all_quality_ids)
        for quality in qualities:
            report_item = PerceivedQualitiesReportItem(id=quality.id, name=quality.name, description=quality.description)
            if shared_qualities.filter(quality__id=quality.id).count() > 0:
                report_item.perceptions = shared_qualities.filter(quality__id=quality.id)
                report_item.type = 'shared'
                report_item.count = shared_qualities.filter(quality__id=quality.id).count()
            elif hidden_qualities.filter(quality__id=quality.id).count() > 0:
                report_item.perceptions = hidden_qualities.filter(quality__id=quality.id)
                report_item.type = 'hidden'
                report_item.count = hidden_qualities.filter(quality__id=quality.id).count()
            elif blind_qualities.filter(quality__id=quality.id).count() > 0:
                report_item.perceptions = blind_qualities.filter(quality__id=quality.id)
                report_item.type = 'blind'
                report_item.count = blind_qualities.filter(quality__id=quality.id).count()
            self.qualities.append(report_item)
