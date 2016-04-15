# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def populate_active_from_employee_zone(apps, schema_editor):
    if schema_editor.connection.schema_name == 'public':
        return
    EmployeeZone = apps.get_model("devzones", "EmployeeZone")
    employee_zones = EmployeeZone.objects.all()
    employee_zones.update(active=True)


def backwards(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0044_auto_20160415_0940'),
    ]

    operations = [
        migrations.RunPython(populate_active_from_employee_zone, backwards),
    ]
