# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0007_auto_20160127_1446'),
    ]

    operations = [
        migrations.AddField(
            model_name='employeezone',
            name='last_question_answered',
            field=models.ForeignKey(related_name='+', blank=True, to='devzones.Question', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employeezone',
            name='new_employee',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='question',
            name='for_new_employees',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(related_name='_answers', to='devzones.Question', null=True),
            preserve_default=True,
        ),
    ]
