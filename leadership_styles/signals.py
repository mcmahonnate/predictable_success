from django.db.models.signals import post_save
from django.dispatch import receiver
from models import EmployeeLeadershipStyle, LeadershipStyleRequest, QuizUrl


@receiver(post_save, sender=LeadershipStyleRequest)
def request_save_handler(sender, instance, created, **kwargs):
    if created:
        instance.send_notification_email()


@receiver(post_save, sender=EmployeeLeadershipStyle)
def leadership_style_save_handler(sender, instance, created, **kwargs):
    if created:
        if instance.request:
            instance.request.was_responded_to = True
            instance.request.save()


@receiver(post_save, sender=QuizUrl)
def quiz_url_save_handler(sender, instance, created, **kwargs):
    if created:
        # Set any other quiz links to inactive.
        QuizUrl.objects.filter(email=instance.email).exclude(id=instance.id).update(active=False)


