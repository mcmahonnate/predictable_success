from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import date
from .models import Employee, Leadership


@receiver(post_save, sender=Employee)
def employee_save_handler(sender, instance, created, **kwargs):
    if not created:
        if instance.departure_date is not None:
            Leadership.objects.filter(employee__id=instance.id).update(end_date=date.today())
            if instance.user is not None:
                instance.user.is_active = False
                instance.user.save()