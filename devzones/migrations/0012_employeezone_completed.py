# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0011_employeezone_answers'),
    ]

    operations = [
        migrations.AddField(
            model_name='employeezone',
            name='completed',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
