# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0009_auto_20150603_1636'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='team_tead',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
