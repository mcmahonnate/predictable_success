# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0002_auto_20150409_1304'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True),
            preserve_default=True,
        ),
    ]
