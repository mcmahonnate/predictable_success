# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0012_employee_uid'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='visited_survey',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
