from django.db.models.signals import post_save
from django.dispatch import receiver, Signal
from .models import FeedbackRequest
from .tasks import send_coach_coachee_requested_feedback_slack

post_many_save = Signal(providing_args=["requester", "feedback_requests"])


@receiver(post_save, sender=FeedbackRequest)
def request_save_handler(sender, instance, created, **kwargs):
    if created:
        instance.send_notification_email()


@receiver(post_many_save)
def request_many_save_handler(sender, requester, feedback_requests, **kwargs):
    coach_slack_name = requester.coach.slack_name
    if coach_slack_name is not None:
        coachee_id = requester.id
        coachee_name = requester.full_name
        reviewer_names = [feedback_request.reviewer.full_name for feedback_request in feedback_requests]
        send_coach_coachee_requested_feedback_slack.subtask((coach_slack_name, coachee_id, coachee_name, reviewer_names)).apply_async()