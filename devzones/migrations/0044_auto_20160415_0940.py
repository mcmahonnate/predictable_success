# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0043_employeezone_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advice',
            name='employee_zone',
            field=models.ForeignKey(related_name='+', blank=True, to='devzones.Zone', null=True),
            preserve_default=True,
        ),
    ]
