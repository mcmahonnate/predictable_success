# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0041_meeting_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conversation',
            name='development_lead_assessment',
            field=models.OneToOneField(related_name='development_led_conversation', null=True, blank=True, to='devzones.EmployeeZone'),
            preserve_default=True,
        ),
    ]
