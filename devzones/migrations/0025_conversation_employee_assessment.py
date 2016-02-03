# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0024_auto_20160202_1642'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='employee_assessment',
            field=models.OneToOneField(related_name='development_conversation', null=True, blank=True, to='devzones.EmployeeZone'),
            preserve_default=True,
        ),
    ]
