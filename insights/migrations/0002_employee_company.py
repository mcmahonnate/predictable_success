# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='company',
            field=models.CharField(default=datetime.datetime(2015, 6, 3, 17, 24, 55, 574046, tzinfo=utc), max_length=64),
            preserve_default=False,
        ),
    ]
