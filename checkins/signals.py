from django.db.models.signals import post_save
from django.dispatch import receiver
from checkins.models import CheckIn
from tasks import send_employee_shared_checkin_notification, send_host_sent_employee_checkin_notification


@receiver(post_save, sender=CheckIn)
def checkin_save_handler(sender, instance, created, update_fields, **kwargs):
    print 'signal'
    if update_fields:
        if 'published' in update_fields and instance.published:
            send_employee_shared_checkin_notification.subtask((instance.id,)).apply_async()
        elif 'visible_to_employee' in update_fields and instance.visible_to_employee:
            send_host_sent_employee_checkin_notification.subtask((instance.id,)).apply_async()