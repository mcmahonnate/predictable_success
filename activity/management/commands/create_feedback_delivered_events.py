from django.core.management.base import BaseCommand
from django.db import connection
from customers.models import Customer
from feedback.models import FeedbackDigest
from ...models import Event
from django.contrib.contenttypes.models import ContentType


class Command(BaseCommand):

    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return
        ContentType.objects.clear_cache()
        feedback_digest_type = ContentType.objects.get_for_model(FeedbackDigest)

        feedback_digests = FeedbackDigest.objects.all()
        feedback_digests = feedback_digests.filter(has_been_delivered=True)
        for feedback_digest in feedback_digests:
            try:
                event = Event.objects.get(event_type=feedback_digest_type, event_id=feedback_digest.id)
            except Event.DoesNotExist:
                event = Event(event_type=feedback_digest_type, event_id=feedback_digest.id, date=feedback_digest.delivery_date, user=feedback_digest.delivered_by.user, employee=feedback_digest.subject, show_conversation=False)
                event.save()
                print "created event for %s" % feedback_digest.subject.full_name