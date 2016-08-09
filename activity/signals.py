from django.db import connection
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
from blah.models import Comment
from customers.models import Customer
from org.models import Employee
from .models import Event, ThirdPartyEvent


@receiver(post_save, sender=ThirdPartyEvent)
def third_party_event_save_handler(sender, instance, created, **kwargs):
    if created:
        content_type = ContentType.objects.get_for_model(sender)
        event = Event(event_type=content_type, event_id=instance.id, employee=instance.employee, user=instance.owner.user, date=instance.date)
        event.save()


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

@receiver(post_delete, sender=Comment)
@receiver(post_delete, sender=ThirdPartyEvent)
def object_delete_handler(sender, instance, **kwargs):
    content_type = ContentType.objects.get_for_model(sender)
    comment_type = ContentType.objects.get_for_model(Comment)
    # Delete events for comments about employees only.
    if content_type.id is comment_type.id:
        if instance.content_type.id is comment_type.id:
            return
    try:
        event = Event.objects.filter(event_type=content_type, event_id=instance.id).delete()
    except:
        return