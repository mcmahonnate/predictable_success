# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations, utils


def create_other_checkintype(apps, schema_editor):
    CheckInType = apps.get_model("checkins", "CheckInType")
    try:
        CheckInType.objects.get(pk=1)
    except CheckInType.DoesNotExist:
        CheckInType(pk=1, name="Other", sort_weight=999).save()
    except utils.ProgrammingError:
        print "ProgrammingError, skipping"
        pass


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '0002_auto_20150630_1501'),
    ]

    operations = [
        migrations.RunPython(create_other_checkintype),
    ]
