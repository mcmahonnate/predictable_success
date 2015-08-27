# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def populate_is_coach_from_coaches_group(apps, schema_editor):
    if schema_editor.connection.schema_name == 'public':
        return
    Employee = apps.get_model("org", "Employee")
    coaches = Employee.objects.filter(user__groups__name='CoachAccess')
    coaches.update(is_coach=True)


def populate_is_lead_from_lead_group(apps, schema_editor):
    if schema_editor.connection.schema_name == 'public':
        return
    Employee = apps.get_model("org", "Employee")
    leads = Employee.objects.filter(user__groups__name='LeadAccess')
    leads.update(is_lead=True)


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0010_add_is_coach_and_is_lead_to_employee'),
    ]

    operations = [
        migrations.RunPython(populate_is_coach_from_coaches_group),
        migrations.RunPython(populate_is_lead_from_lead_group),
    ]
