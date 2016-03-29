# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0036_employeezone_zones'),
    ]

    operations = [
        migrations.AddField(
            model_name='employeezone',
            name='is_draft',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employeezone',
            name='share_with_employee',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
