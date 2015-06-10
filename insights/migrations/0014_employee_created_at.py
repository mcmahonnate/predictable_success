# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0013_employee_visited_survey'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 6, 8, 18, 59, 27, 577916, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
    ]
