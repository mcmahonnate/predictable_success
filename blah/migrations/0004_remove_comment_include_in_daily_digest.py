# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blah', '0003_auto_20150521_1441'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='include_in_daily_digest',
        ),
    ]
