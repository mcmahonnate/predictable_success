# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0002_employee_linkedin_id'),
        ('engagement', '0003_surveyurl'),
    ]

    operations = [
        migrations.AddField(
            model_name='surveyurl',
            name='completed',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='surveyurl',
            name='sent_from',
            field=models.ForeignKey(related_name='+', to='org.Employee', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='surveyurl',
            name='active',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
