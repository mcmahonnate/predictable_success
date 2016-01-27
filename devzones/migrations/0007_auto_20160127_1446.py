# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0006_auto_20160127_1300'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employeezone',
            name='answers',
            field=models.ManyToManyField(related_name='+', to='devzones.Answer'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='employeezone',
            name='zone',
            field=models.ForeignKey(related_name='+', blank=True, to='devzones.Zone', null=True),
            preserve_default=True,
        ),
    ]
