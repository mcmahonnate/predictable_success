import blah
from blah.models import Comment
from datetime import datetime
from django.db import models
from django.db.models import Sum
from org.models import Employee


class ScoringCriteria(models.Model):
    name = models.CharField(
        max_length=255,
    )
    description = models.TextField()
    def __unicode__(self):
        return self.name


class ScoringOption(models.Model):
    name = models.CharField(
        max_length=255,
    )
    criteria = models.ForeignKey(ScoringCriteria, related_name='options')
    description = models.TextField()
    value = models.IntegerField(default=0)

    def __unicode__(self):
        return self.name


class ProjectManager(models.Manager):
    def get_for_owner(self, owner):
        return self.filter(owners=owner)

    def get_for_sponsor(self, sponsor):
        return self.filter(sponsors=sponsor)

    def get_for_team_member(self, team_member):
        return self.filter(team_members=team_member)


class Project(models.Model):
    objects = ProjectManager()
    name = models.CharField(
        max_length=255,
    )
    description = models.TextField()
    sponsors = models.ManyToManyField(Employee, related_name='projects_sponsored', null=False, blank=False)
    owners = models.ManyToManyField(Employee, related_name='projects_owned', null=False, blank=False)
    team_members = models.ManyToManyField(Employee, related_name='projects_team_member', null=False, blank=False)
    scores = models.ManyToManyField(ScoringOption, related_name='projects_scored', null=False, blank=False)

    @property
    def comments(self):
        return list(Comment.objects.get_for_object(self))

    def total_score(self):
        score = self.scores.aggregate(Sum('value')).values()[0]
        if score is not None:
            return score
        else:
            return 0

    def __unicode__(self):
        return self.name


class PrioritizationRule(models.Model):
    date = models.DateTimeField(null=False, blank=False, default=datetime.now)
    description = models.TextField()
    criteria = models.ManyToManyField(ScoringCriteria, related_name='rules', null=False, blank=False)

    def __unicode__(self):
        return self.name


blah.register(Project, attr_name='_comments')