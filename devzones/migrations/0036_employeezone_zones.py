# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0035_auto_20160225_1543'),
    ]

    operations = [
        migrations.AddField(
            model_name='employeezone',
            name='zones',
            field=models.ManyToManyField(related_name='+', null=True, to='devzones.Zone', blank=True),
            preserve_default=True,
        ),
    ]
