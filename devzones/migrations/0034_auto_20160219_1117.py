# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0033_auto_20160219_1059'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advice',
            name='alert_for_development_lead',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='advice',
            name='alert_for_employee',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
    ]
