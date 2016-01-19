from django.db.models.signals import post_save
from django.dispatch import receiver
from checkins.models import CheckIn, CheckInRequest
from tasks import *


@receiver(post_save, sender=CheckIn)
def checkin_save_handler(sender, instance, created, update_fields, **kwargs):
    if created:
        # Close any outstanding Check-in requests
        checkin_requests = CheckInRequest.objects.filter(requester=instance.employee, host=instance.host)
        checkin_requests.update(was_responded_to=True)
        checkin_request = checkin_requests.order_by('request_date').first()
        if checkin_request is not None:
            instance.checkin_request = checkin_request
            instance.save()
    elif update_fields:
        if 'published' in update_fields and instance.published:
            send_employee_shared_checkin_notification.subtask((instance.id,)).apply_async()
        elif 'visible_to_employee' in update_fields and instance.visible_to_employee:
            send_host_sent_employee_checkin_notification.subtask((instance.id,)).apply_async()


@receiver(post_save, sender=CheckInRequest)
def checkin_request_save_handler(sender, instance, created, update_fields, **kwargs):
    if created:
        send_checkin_request_notification.subtask((instance.id,)).apply_async()