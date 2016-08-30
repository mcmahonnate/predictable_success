# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employee',
            name='yei_id',
        ),
        migrations.AlterField(
            model_name='employee',
            name='hire_date',
            field=models.DateField(default=None, null=True, blank=True),
            preserve_default=True,
        ),
    ]
