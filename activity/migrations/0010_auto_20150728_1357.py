# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('activity', '0009_auto_20150727_1548'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 28, 13, 57, 1, 577627)),
            preserve_default=True,
        ),
    ]
