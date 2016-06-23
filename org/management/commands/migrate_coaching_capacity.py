from django.core.management.base import BaseCommand
from django.db import connection
from org.models import CoachCapacity, CoachProfile


class Command(BaseCommand):
    def handle(self, *args, **options):
        if connection.schema_name == 'fool':
            coaching_capacities = CoachCapacity.objects.filter(employee__departure_date__isnull=True)
            for coaching_capacity in coaching_capacities:
                coaching_profile = CoachProfile(employee=coaching_capacity.employee,
                                                max_allowed_coachees=coaching_capacity.max_allowed_coachees)
                coaching_profile.save()
                print coaching_profile.employee.full_name
        return