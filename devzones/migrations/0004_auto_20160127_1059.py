# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0003_auto_20160127_1028'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='randomize_next_questions',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='question',
            name='randomize_answers',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='answer',
            name='next_questions',
            field=models.ForeignKey(related_name='+', blank=True, to='devzones.Question', null=True),
            preserve_default=True,
        ),
    ]
