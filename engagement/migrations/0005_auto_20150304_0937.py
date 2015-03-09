# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('engagement', '0004_auto_20150304_0935'),
    ]

    operations = [
        migrations.AlterField(
            model_name='surveyurl',
            name='completed',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
