# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pvp', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='evaluationround',
            options={'get_latest_by': 'date'},
        ),
        migrations.AlterField(
            model_name='evaluationround',
            name='is_complete',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='pvpevaluation',
            name='is_complete',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
