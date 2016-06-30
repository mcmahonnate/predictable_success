import blah
from blah.models import Comment
from datetime import datetime
from django.db import models
from org.models import Employee
from engagement.models import Happiness
from customers.models import current_customer
from model_utils import FieldTracker


class CheckInType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    sort_weight = models.IntegerField(default=0)

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['sort_weight']


class CheckInRequestManager(models.Manager):
    def pending_for_host(self, host):
        return self.filter(host=host, was_responded_to=False, was_canceled=False)

    def unanswered_for_requester(self, requester):
        return self.filter(requester=requester, was_responded_to=False, was_canceled=False)


class CheckInRequest(models.Model):
    objects = CheckInRequestManager()
    request_date = models.DateTimeField(auto_now_add=True)
    requester = models.ForeignKey(Employee, related_name='checkin_requests')
    host = models.ForeignKey(Employee, related_name='requests_for_checkin')
    was_responded_to = models.BooleanField(default=False)
    was_canceled = models.BooleanField(default=False)
    message = models.TextField(blank=True)

    @property
    def has_been_answered(self):
        return hasattr(self, 'checkin')

    def __str__(self):
        return "Check-in request from %s for %s" % (self.requester, self.host)


class CheckInManager(models.Manager):
    def get_all_for_employee(self, employee):
        return self.filter(employee=employee)

    def get_all_for_host(self, host):
        checkins = self.filter(host=host)
        checkins = checkins.filter(shareable=True)
        return checkins

    def get_all_visible_to_employee(self, employee):
        checkins = self.get_all_for_employee(employee)
        return checkins.filter(visible_to_employee=True)

    def get_all_publish_reminders(self):
        checkins = self.filter(visible_to_employee=True, published=False, sent_publish_reminder=False)
        return checkins

    def get_all_send_reminders(self):
        checkins = self.filter(shareable=True, visible_to_employee=False)
        return checkins


class CheckIn(models.Model):
    objects = CheckInManager()
    employee = models.ForeignKey(Employee, related_name='checkins', null=False, blank=False)
    host = models.ForeignKey(Employee, related_name='checkins_hosted', null=False, blank=False)
    date = models.DateTimeField(null=True, blank=True)
    summary = models.TextField(null=True, blank=True)
    type = models.ForeignKey(CheckInType, related_name='+', null=True)
    other_type_description = models.CharField(max_length=100, null=True, blank=True)
    happiness = models.ForeignKey(Happiness, null=True, blank=True)
    published = models.BooleanField(default=False)
    published_date = models.DateTimeField(null=True, blank=True)
    sent_publish_reminder = models.BooleanField(default=False)
    visible_to_employee = models.BooleanField(default=False)
    visible_to_employee_date = models.DateTimeField(null=True, blank=True)
    shareable = models.BooleanField(default=False)
    checkin_request = models.OneToOneField(CheckInRequest, null=True, blank=True, related_name='checkin')
    field_tracker = FieldTracker(fields=['published', 'visible_to_employee'])

    class Meta:
        get_latest_by = "date"
        permissions = (
            ("view_checkin_summary", "Can view the summary of the Check In."),
        )

    def save(self, *args, **kwargs):
        tenant = current_customer()
        if tenant.show_shareable_checkins:
            self.shareable = True
        if self.field_tracker.has_changed('published') and self.published:
            self.published_date = datetime.now()
        if self.field_tracker.has_changed('visible_to_employee') and self.visible_to_employee:
            self.visible_to_employee_date = datetime.now()

        super(CheckIn, self).save(*args, **kwargs)

    @property
    def comments(self):
        return list(Comment.objects.get_for_object(self))

    def get_summary(self, user):
        if self.shareable:
            if self.published:
                return self.summary
            elif user.employee.id == self.employee.id or \
                    user.employee.id == self.host.id:
                return self.summary
        else:
            if user.has_perm('checkins.view_checkin_summary'):
                return self.summary
        return None

    def get_type_description(self):
        if self.type is not None:
            return self.type.name
        return self.other_type_description

    def __unicode__(self):
        return u'{0} "{1}" Check-in with {2}'.format(self.host, self.get_type_description(), self.employee)

blah.register(CheckIn, attr_name='_comments')
