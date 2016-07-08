from datetime import date
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from preferences.models import UserPreferences
from .models import Employee, Leadership


@receiver(post_save, sender=Employee)
def employee_save_handler(sender, instance, created, **kwargs):
    if not created:
        if instance.departure_date is not None:
            Leadership.objects.filter(employee__id=instance.id).update(end_date=date.today())
            if instance.user is not None:
                instance.user.is_active = False
                instance.user.save()


@receiver(post_save, sender=User)
def user_save_handler(sender, instance, created, **kwargs):
    if created:
        preferences = UserPreferences(user=instance)
        preferences.save()
