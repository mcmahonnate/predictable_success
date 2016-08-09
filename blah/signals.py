from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Comment
from .tasks import send_comment_reply_notification


@receiver(post_save, sender=Comment)
def comment_save_handler(sender, instance, created, **kwargs):
    if created:
        comment_content_type = ContentType.objects.get_for_model(Comment)
        if instance.content_type is comment_content_type:
            send_comment_reply_notification.subtask((instance.id,)).apply_async()
