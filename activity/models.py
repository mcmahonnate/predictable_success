from django.db import models
from django.contrib.contenttypes.models import ContentType
from org.models import Employee
from django.db.models.signals import post_save
from django.dispatch import receiver
from blah.models import Comment
from django.contrib.auth.models import User
import datetime
from django.utils.log import getLogger

logger = getLogger('talentdashboard')

class Event(models.Model):
    event_type = models.ForeignKey(ContentType, related_name = 'event_type')
    event_id = models.PositiveIntegerField('object id', db_index = True)
    user = models.ForeignKey(User, related_name='+')
    employee = models.ForeignKey(Employee, related_name='+')
    date = models.DateTimeField(null=False, blank=False, default=datetime.datetime.now())

    def __str__(self):
        return "%s created an event relating to %s" % (self.user.email, self.employee.full_name)

@receiver(post_save, sender=Comment)
def comment_save_handler(sender, instance, created, **kwargs):
    if created:
        content_type = ContentType.objects.get_for_model(sender)
        employee_type = ContentType.objects.get_for_model(Employee)
        user_type = ContentType.objects.get_for_model(User)
        # Create events for comments about employees only.
        if instance.content_type is employee_type:
            employee = employee_type.get_object_for_this_type(pk=instance.object_id)
            user = user_type.get_object_for_this_type(pk=instance.owner_id)
            event = Event(event_type=content_type, event_id=instance.id, employee=employee, user=user, date=instance.created_date)
            event.save()
