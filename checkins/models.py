import blah
from django.db import models
from blah.models import Comment
from org.models import Employee
from engagement.models import Happiness


class CheckInType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    sort_weight = models.IntegerField(default=0)

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['sort_weight']


class CheckIn(models.Model):
    employee = models.ForeignKey(Employee, related_name='checkins', null=False, blank=False)
    host = models.ForeignKey(Employee, related_name='checkins_hosted', null=False, blank=False)
    date = models.DateTimeField(null=True, blank=True)
    summary = models.TextField(null=True, blank=True)
    type = models.ForeignKey(CheckInType, related_name='+', null=True)
    other_type_description = models.CharField(max_length=100, null=True, blank=True)
    happiness = models.ForeignKey(Happiness, null=True, blank=True)

    class Meta:
        get_latest_by = "date"
        permissions = (
            ("view_checkin_summary", "Can view the summary of the Check In."),
        )

    def get_summary(self, user):
        if user.has_perm('checkins.view_checkin_summary'):
            return self.summary
        return None

    def get_type_description(self):
        if self.type is not None:
            return self.type.name
        return self.other_type_description

    def __unicode__(self):
        return u'{0} "{1}" Check-in with {2} on {3}'.format(self.host, self.get_type_description(), self.employee, self.date.strftime('%x'))

blah.register(CheckIn)
