# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0028_employeezone_times_taken'),
    ]

    operations = [
        migrations.RenameField(
            model_name='employeezone',
            old_name='times_taken',
            new_name='times_retaken',
        ),
    ]
