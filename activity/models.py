from django.db import models
from django.contrib.contenttypes.models import ContentType
from org.models import Employee
import datetime


class Event(models.Model):
    event_type = models.ForeignKey(ContentType, related_name = 'event_type')
    event_id = models.PositiveIntegerField('object id', db_index = True)
    user = models.ForeignKey(Employee, related_name='+')
    employee = models.ForeignKey(Employee, related_name='+')
    date = models.DateTimeField(null=False, blank=False, default=datetime.date.today)

    def __str__(self):
        return "%s created an event relating to %s" % (self.user.full_name, self.employee.full_name)