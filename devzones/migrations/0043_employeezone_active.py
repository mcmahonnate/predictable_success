# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0042_auto_20160408_1602'),
    ]

    operations = [
        migrations.AddField(
            model_name='employeezone',
            name='active',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
