from django.db import models
from django.contrib.contenttypes.models import ContentType
from org.models import Employee
from django.contrib.auth.models import User
import datetime
from django.utils.log import getLogger

logger = getLogger('talentdashboard')


class EventManager(models.Manager):
    """
    A manager that retrieves events for a particular model.
    """
    def get_events_for_all_employees(self, requester):
        events = self.exclude(employee__id=requester.id)
        events = events.extra(order_by=['-date'])

        return events

    def get_events_for_employee(self, requester, employee):
        events = self.get_events_for_all_employees(requester)
        events = events.filter(employee__id=employee.id)

        return events

    def get_events_for_employees(self, requester, employee_ids):
        events = self.get_events_for_all_employees(requester)
        events = events.filter(employee__id__in=employee_ids)

        return events

    def get_events_for_object(self, obj):
        content_type = ContentType.objects.get_for_model(obj)
        return self.filter(event_type__pk=content_type.pk, event_id=obj.pk)


class Event(models.Model):
    event_type = models.ForeignKey(ContentType, related_name='event_type')
    event_id = models.PositiveIntegerField('object id', db_index=True)
    user = models.ForeignKey(User, related_name='+')
    employee = models.ForeignKey(Employee, related_name='+')
    date = models.DateTimeField(null=False, blank=False, default=datetime.datetime.now)

    objects = EventManager()

    def __str__(self):
        return "%s created a %s about %s" % (self.user.email, self.event_type.name, self.employee.full_name)
