# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0020_employee_yei_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='slack_name',
            field=models.CharField(max_length=255, null=True, blank=True),
            preserve_default=True,
        ),
    ]
