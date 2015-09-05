from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
from blah.models import Comment
from checkins.models import CheckIn
from org.models import Employee
from .models import Event


@receiver(post_save, sender=Comment)
def comment_save_handler(sender, instance, created, **kwargs):
    if created:
        content_type = ContentType.objects.get_for_model(sender)
        employee_type = ContentType.objects.get_for_model(Employee)
        user_type = ContentType.objects.get_for_model(User)
        if instance.content_type is employee_type:
            employee = employee_type.get_object_for_this_type(pk=instance.object_id)
            user = user_type.get_object_for_this_type(pk=instance.owner_id)
            event = Event(event_type=content_type, event_id=instance.id, employee=employee, user=user, date=instance.created_date)
            event.save()


@receiver(post_save, sender=CheckIn)
def checkin_save_handler(sender, instance, created, **kwargs):
    if created:
        content_type = ContentType.objects.get_for_model(sender)
        employee = instance.employee
        user = instance.host.user
        date = instance.date
        event = Event(event_type=content_type, event_id=instance.id, employee=employee, user=user, date=date)
        event.save()


@receiver(post_delete, sender=Comment)
@receiver(post_delete, sender=CheckIn)
def object_delete_handler(sender, instance, **kwargs):
    content_type = ContentType.objects.get_for_model(sender)
    comment_type = ContentType.objects.get_for_model(Comment)
    # Delete events for comments about employees only.
    if content_type.id is comment_type.id:
        if instance.content_type.id is comment_type.id:
            return
    try:
        event = Event.objects.get(event_type=content_type, event_id=instance.id)
        event.delete()
    except:
        return