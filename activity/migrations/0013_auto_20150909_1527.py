# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('activity', '0012_auto_20150909_1451'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2015, 9, 9, 15, 27, 3, 264968)),
            preserve_default=True,
        ),
    ]
