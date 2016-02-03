# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0017_auto_20160202_1154'),
    ]

    operations = [
        migrations.AddField(
            model_name='advice',
            name='completed',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
