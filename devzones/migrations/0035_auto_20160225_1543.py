# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0034_auto_20160219_1117'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='order',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='question',
            name='order',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
