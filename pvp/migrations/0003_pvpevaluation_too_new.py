# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pvp', '0002_auto_20150430_1000'),
    ]

    operations = [
        migrations.AddField(
            model_name='pvpevaluation',
            name='too_new',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
