# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0002_auto_20160127_1021'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='next_questions',
            field=models.ForeignKey(related_name='previous_question', blank=True, to='devzones.Question', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='answer',
            name='zone',
            field=models.ForeignKey(related_name='+', blank=True, to='devzones.Zone', null=True),
            preserve_default=True,
        ),
    ]
