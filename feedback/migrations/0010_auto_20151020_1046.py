# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0009_auto_20151016_1538'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbacksubmission',
            name='could_improve_on_summarized',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='feedbacksubmission',
            name='excels_at_summarized',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
    ]
