# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0016_auto_20150610_1550'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='email',
            field=models.EmailField(default=datetime.datetime(2015, 6, 10, 20, 6, 17, 10086, tzinfo=utc), unique=True, max_length=75),
            preserve_default=False,
        ),
    ]
