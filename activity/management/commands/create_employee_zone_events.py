from django.core.management.base import BaseCommand
from django.db import connection
from customers.models import Customer
from devzones.models import EmployeeZone, Conversation
from ...models import Event
from django.contrib.contenttypes.models import ContentType


class Command(BaseCommand):

    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return
        ContentType.objects.clear_cache()
        employee_zone_type = ContentType.objects.get_for_model(EmployeeZone)

        employee_zones = EmployeeZone.objects.all()
        employee_zones = employee_zones.filter(completed=True)
        for employee_zone in employee_zones:
            try:
                event = Event.objects.get(event_type=employee_zone_type, event_id=employee_zone.id)
            except Event.DoesNotExist:
                if employee_zone.completed:
                    try:
                        conversation = employee_zone.development_led_conversation
                    except Conversation.DoesNotExist:
                        conversation = None
                    if conversation is not None \
                        or employee_zone.employee.id == employee_zone.assessor.id:
                            event = Event(event_type=employee_zone_type, event_id=employee_zone.id, employee=employee_zone.employee, user=employee_zone.assessor.user, show_conversation=True, date=employee_zone.date)
                            event.save()
                            print "created event for %s" % employee_zone.employee.full_name