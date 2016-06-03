from blah.models import Comment
from checkins.models import CheckIn
from devzones.models import EmployeeZone
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
from feedback.models import FeedbackDigest
from org.models import Employee
import datetime


class ThirdParty(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    url = models.CharField(max_length=255, null=False, blank=False)
    verb = models.CharField(max_length=100, null=True, blank=True)
    image_url = models.CharField(max_length=255, null=True, blank=True)


class ThirdPartyEvent(models.Model):
    third_party = models.ForeignKey(ThirdParty, related_name='events')
    object_id = models.CharField(max_length=255, null=False, blank=False)
    employee = models.ForeignKey(Employee, null=False, blank=False, related_name='+')
    owner = models.ForeignKey(Employee, null=False, blank=False, related_name='+')
    date = models.DateTimeField(null=False, blank=False)
    description = models.TextField(null=True, blank=True)


class EventManager(models.Manager):
    """
    A manager that retrieves events for a particular model.
    """

    def get_events_for_all_employees(self, requester, exclude_third_party_events=True, type=None, third_party=None):
        events = self.exclude(employee__id=requester.id)
        if type:
            events = events.filter(event_type__pk=type.pk)
        if exclude_third_party_events:
            content_type = ContentType.objects.get_for_model(ThirdPartyEvent)
            events = events.exclude(event_type__pk=content_type.pk)
        elif third_party:
            third_party_event_content_type = ContentType.objects.get_for_model(ThirdPartyEvent)
            if type.id == third_party_event_content_type.id:
                third_party_event_ids = ThirdPartyEvent.objects.filter(third_party=third_party).values_list('id', flat=True)
                events = events.filter(event_id__in=third_party_event_ids)
        events = events.extra(order_by=['-date'])

        return events

    def get_events_for_employee(self, requester, employee, exclude_third_party_events=True, type=None, third_party=None):
        events = self.get_events_for_all_employees(requester=requester, exclude_third_party_events=exclude_third_party_events,
                                                   type=type, third_party=third_party)
        events = events.filter(employee__id=employee.id)
        return events

    def get_events_for_employees(self, requester, employee_ids, exclude_third_party_events=True, type=None, third_party=None):
        events = self.get_events_for_all_employees(requester=requester, exclude_third_party_events=exclude_third_party_events,
                                                   type=type, third_party=third_party)
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
        third_party_event_type = ContentType.objects.get_for_model(ThirdPartyEvent)
        if self.event_type.id is comment_type.id:
            comment = Comment.objects.get(pk=self.event_id)
            return comment.content
        elif self.event_type.id is employee_zone_type.id:
            employee_zone = EmployeeZone.objects.get(pk=self.event_id)
            return employee_zone.notes
        elif self.event_type.id is checkin_type.id:
            checkin = CheckIn.objects.get(pk=self.event_id)
            return checkin.get_summary(user)
        elif self.event_type.id is third_party_event_type.id:
            third_party_event = ThirdPartyEvent.objects.get(pk=self.event_id)
            return third_party_event.description
        return None

    @property
    def verb(self):
        comment_type = ContentType.objects.get_for_model(Comment)
        checkin_type = ContentType.objects.get_for_model(CheckIn)
        feedback_digest_type = ContentType.objects.get_for_model(FeedbackDigest)
        employee_zone_type = ContentType.objects.get_for_model(EmployeeZone)
        third_party_event_type = ContentType.objects.get_for_model(ThirdPartyEvent)
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
        elif self.event_type.id is third_party_event_type.id:
            third_party_event = ThirdPartyEvent.objects.get(id=self.event_id)
            return third_party_event.third_party.verb
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
