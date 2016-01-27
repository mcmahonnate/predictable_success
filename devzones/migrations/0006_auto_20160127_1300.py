# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0005_auto_20160127_1100'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='answer',
            name='next_question',
        ),
        migrations.RemoveField(
            model_name='answer',
            name='randomize_next_questions',
        ),
        migrations.RemoveField(
            model_name='question',
            name='answers',
        ),
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(related_name='answers', to='devzones.Question', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='question',
            name='previous_question',
            field=models.ForeignKey(related_name='next_questions', blank=True, to='devzones.Question', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='question',
            name='randomize_next_questions',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
