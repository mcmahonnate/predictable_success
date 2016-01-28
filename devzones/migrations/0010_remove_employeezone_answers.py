# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0009_auto_20160127_1642'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employeezone',
            name='answers',
        ),
    ]
