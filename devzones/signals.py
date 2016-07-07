from datetime import datetime
from django.db.models.signals import post_save
from django.dispatch import receiver
from devzones.models import Conversation, EmployeeZone, Meeting
from devzones.tasks import send_conversation_shared_notification, send_selfie_notification


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
            # send_conversation_shared_notification.subtask((conversation.id,)).apply_async()
            conversation.is_draft = False
            conversation.date = datetime.now()
            conversation.completed = True
            conversation.save()
        if 'active' in update_fields and instance.active:
            send_selfie_notification.subtask((instance.id,)).apply_async()


@receiver(post_save, sender=Meeting)
def meeting_save_handler(sender, instance, created, update_fields, **kwargs):
    if not created and update_fields:
        if 'active' in update_fields and instance.active:
            conversations = Conversation.objects.get_for_meeting(instance)
            for conversation in conversations:
                if not conversation.employee_assessment.active:
                    conversation.employee_assessment.active = True
                    conversation.employee_assessment.save(update_fields=['active'])
