# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '0004_auto_20150706_1241'),
    ]

    operations = [
        migrations.AlterField(
            model_name='checkintype',
            name='sort_weight',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
