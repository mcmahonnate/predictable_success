from blah.models import Comment
from checkins.models import CheckIn
from devzones.models import EmployeeZone
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
from django.utils.log import getLogger
from feedback.models import FeedbackDigest
from org.models import Employee
import datetime

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
    show_conversation = models.BooleanField(default=True)
    objects = EventManager()

    def description(self, user):
        if not self.show_conversation:
            return None
        comment_type = ContentType.objects.get_for_model(Comment)
        checkin_type = ContentType.objects.get_for_model(CheckIn)
        employee_zone_type = ContentType.objects.get_for_model(EmployeeZone)
        if self.event_type.id is comment_type.id:
            comment = Comment.objects.get(pk=self.event_id)
            return comment.content
        elif self.event_type.id is employee_zone_type.id:
            employee_zone = EmployeeZone.objects.get(pk=self.event_id)
            return employee_zone.notes
        elif self.event_type.id is checkin_type.id:
            checkin = CheckIn.objects.get(pk=self.event_id)
            return checkin.get_summary(user)
        return None

    @property
    def verb(self):
        comment_type = ContentType.objects.get_for_model(Comment)
        checkin_type = ContentType.objects.get_for_model(CheckIn)
        feedback_digest_type = ContentType.objects.get_for_model(FeedbackDigest)
        employee_zone_type = ContentType.objects.get_for_model(EmployeeZone)
        if self.event_type.id is comment_type.id:
            return 'wrote a note'
        elif self.event_type.id is employee_zone_type.id:
            employee_zone = EmployeeZone.objects.get(pk=self.event_id)
            if employee_zone.employee.id == employee_zone.assessor.id:
                return 'took a selfie'
            else:
                return 'had a development conversation'
        elif self.event_type.id is feedback_digest_type.id:
            return 'delivered feedback'
        elif self.event_type.id is checkin_type.id:
            check_in = CheckIn.objects.get(id=self.event_id)
            if check_in.employee.user == self.user:
                return 'shared their %s check-in' % check_in.get_type_description()
            else:
                return 'had a %s check-in' % check_in.get_type_description()
        return None

    @property
    def associated_object(self):
        if self.event_type is not None and self.event_id is not None:
            return self.event_type.get_object_for_this_type(pk=self.event_id)
        else:
            return None

    class Meta:
        permissions = (
            ("receive_daily_digest", "Receive daily digest of events"),
        )

    def __str__(self):
        return "%s created a %s about %s" % (self.user.email, self.event_type.name, self.employee.full_name)
