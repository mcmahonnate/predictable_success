# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0039_auto_20160406_1611'),
    ]

    operations = [
        migrations.AddField(
            model_name='advice',
            name='severity',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
