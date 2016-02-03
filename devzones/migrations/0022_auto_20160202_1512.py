# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0021_auto_20160202_1320'),
    ]

    operations = [
        migrations.RenameField(
            model_name='zone',
            old_name='long_description',
            new_name='description',
        ),
        migrations.RemoveField(
            model_name='zone',
            name='short_description',
        ),
        migrations.AlterField(
            model_name='advice',
            name='development_lead_zone',
            field=models.ForeignKey(related_name='+', blank=True, to='devzones.Zone', null=True),
            preserve_default=True,
        ),
    ]
