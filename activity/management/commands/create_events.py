from django.core.management.base import BaseCommand
from django.db import connection
from customers.models import Customer
from blah.models import Comment
from checkins.models import CheckIn
from ...models import Event
from org.models import Employee
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User


class Command(BaseCommand):

    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return
        ContentType.objects.clear_cache()
        comment_type = ContentType.objects.get_for_model(Comment)
        checkin_type = ContentType.objects.get_for_model(CheckIn)
        employee_type = ContentType.objects.get_for_model(Employee)
        comments = Comment.objects.filter(content_type=employee_type)
        for comment in comments:
            try:
                event = Event.objects.get(event_type=comment_type, event_id=comment.id)
            except Event.DoesNotExist:
                user = User.objects.get(id=comment.owner_id)
                employee = Employee.objects.get(id=comment.object_id)
                event = Event(event_type=comment_type, event_id=comment.id, date=comment.created_date, user=user, employee=employee)
                event.save()

        checkins = CheckIn.objects.all()
        for checkin in checkins:
            try:
                event = Event.objects.get(event_type=checkin_type, event_id=checkin.id)
            except Event.DoesNotExist:
                event = Event(event_type=checkin_type, event_id=checkin.id, date=checkin.date, user=checkin.host.user, employee=checkin.employee)
                event.save()