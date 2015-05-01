# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0002_employee_linkedin_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='display',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
