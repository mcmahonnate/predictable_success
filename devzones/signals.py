from django.db.models.signals import post_save
from django.dispatch import receiver
from devzones.models import Conversation, EmployeeZone


@receiver(post_save, sender=Conversation)
def conversation_save_handler(sender, instance, created, update_fields, **kwargs):
    if created:
        employee_zone = EmployeeZone()
        employee_zone.employee = instance.employee
        employee_zone.assessor = instance.employee
        employee_zone.save()
        instance.employee_assessment = employee_zone
        instance.save()