# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0038_remove_employeezone_share_with_employee'),
    ]

    operations = [
        migrations.AddField(
            model_name='advice',
            name='alert_for_development_lead_short',
            field=models.CharField(default=b'', max_length=255, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='advice',
            name='alert_for_employee_short',
            field=models.CharField(default=b'', max_length=255, blank=True),
            preserve_default=True,
        ),
    ]
