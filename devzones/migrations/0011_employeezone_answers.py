# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0010_remove_employeezone_answers'),
    ]

    operations = [
        migrations.AddField(
            model_name='employeezone',
            name='answers',
            field=models.ManyToManyField(related_name='+', null=True, to='devzones.Answer', blank=True),
            preserve_default=True,
        ),
    ]
