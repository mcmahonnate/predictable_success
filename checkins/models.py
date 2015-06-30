from django.db import models
from org.models import Employee
from engagement.models import Happiness


class CheckIn(models.Model):
    employee = models.ForeignKey(Employee, related_name='checkins', null=False, blank=False)
    host = models.ForeignKey(Employee, related_name='checkins_hosted', null=False, blank=False)
    date = models.DateTimeField(null=False, blank=False)
    summary = models.TextField(null=False, blank=False)
    happiness = models.ForeignKey(Happiness, null=True, blank=True)
