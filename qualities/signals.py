from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import PerceptionRequest, PerceivedQuality


@receiver(post_save, sender=PerceptionRequest)
def request_save_handler(sender, instance, created, **kwargs):
    if created:
        instance.send_notification_email()


@receiver(post_save, sender=PerceivedQuality)
def perceived_quality_save_handler(sender, instance, created, **kwargs):
    if created:
        if instance.perception_request:
            instance.perception_request.was_responded_to = True
            instance.perception_request.save()