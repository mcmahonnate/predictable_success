# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0018_advice_completed'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='advice',
            name='completed',
        ),
        migrations.AddField(
            model_name='conversation',
            name='completed',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
