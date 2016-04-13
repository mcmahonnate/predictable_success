from django.db.models.signals import post_save
from django.dispatch import receiver
from devzones.models import Conversation, EmployeeZone
from devzones.tasks import send_conversation_shared_notification


@receiver(post_save, sender=Conversation)
def conversation_save_handler(sender, instance, created, update_fields, **kwargs):
    if created:
        employee_zone = EmployeeZone()
        employee_zone.employee = instance.employee
        employee_zone.assessor = instance.employee
        employee_zone.save()
        instance.employee_assessment = employee_zone
        instance.save()


@receiver(post_save, sender=EmployeeZone)
def employee_zone_save_handler(sender, instance, created, update_fields, **kwargs):
    if not created and update_fields:
        if 'completed' in update_fields and instance.completed and instance.development_led_conversation:
            conversation = instance.development_led_conversation
            send_conversation_shared_notification.subtask((conversation.id,)).apply_async()
            conversation.is_draft = False
            conversation.completed = True
            conversation.save()
