# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0046_populate_meeting_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='zone',
            name='value',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
