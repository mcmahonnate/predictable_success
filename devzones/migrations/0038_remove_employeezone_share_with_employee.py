# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0037_auto_20160328_1104'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employeezone',
            name='share_with_employee',
        ),
    ]
