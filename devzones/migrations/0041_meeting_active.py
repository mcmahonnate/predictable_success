# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0040_advice_severity'),
    ]

    operations = [
        migrations.AddField(
            model_name='meeting',
            name='active',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
