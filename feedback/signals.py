from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import FeedbackRequest

@receiver(post_save, sender=FeedbackRequest)
def request_save_handler(sender, instance, created, **kwargs):
    if created:
        instance.send_notification_email()
