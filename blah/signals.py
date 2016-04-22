from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Comment
from checkins.models import CheckIn
from devzones.models import EmployeeZone
from .tasks import send_comment_reply_notification, send_checkin_reply_notification, send_employee_zone_reply_notification


@receiver(post_save, sender=Comment)
def comment_save_handler(sender, instance, created, **kwargs):
    if created:
        comment_content_type = ContentType.objects.get_for_model(Comment)
        checkin_content_type = ContentType.objects.get_for_model(CheckIn)
        employee_zone_content_type = ContentType.objects.get_for_model(EmployeeZone)
        if instance.content_type is comment_content_type:
            send_comment_reply_notification.subtask((instance.id,)).apply_async()
        elif instance.content_type is checkin_content_type:
            send_checkin_reply_notification.subtask((instance.id,)).apply_async()
        elif instance.content_type is employee_zone_content_type:
            send_employee_zone_reply_notification.subtask((instance.id,)).apply_async()