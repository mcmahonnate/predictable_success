# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def populate_active_from_meeting(apps, schema_editor):
    if schema_editor.connection.schema_name == 'public':
        return
    Meeting = apps.get_model("devzones", "Meeting")
    meetings = Meeting.objects.all()
    meetings.update(active=True)


def backwards(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0045_populate_employee_zone_active'),
    ]

    operations = [
        migrations.RunPython(populate_active_from_meeting, backwards),
    ]