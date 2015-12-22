# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0013_auto_20151209_1321'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbacksubmission',
            name='could_improve_on_was_helpful_date',
            field=models.DateTimeField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='feedbacksubmission',
            name='excels_at_was_helpful_date',
            field=models.DateTimeField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
