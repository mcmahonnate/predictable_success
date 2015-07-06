from django.db import models
from org.models import Employee
from engagement.models import Happiness


class CheckInType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    sort_weight = models.IntegerField(default=0)

    class Meta:
        ordering = ['sort_weight']


class CheckIn(models.Model):
    employee = models.ForeignKey(Employee, related_name='checkins', null=False, blank=False)
    host = models.ForeignKey(Employee, related_name='checkins_hosted', null=False, blank=False)
    date = models.DateTimeField(null=False, blank=False)
    summary = models.TextField(null=False, blank=False)
    type = models.ForeignKey(CheckInType, related_name='+', null=True)
    other_type_description = models.CharField(max_length=100, null=True, blank=True)
    happiness = models.ForeignKey(Happiness, null=True, blank=True)


