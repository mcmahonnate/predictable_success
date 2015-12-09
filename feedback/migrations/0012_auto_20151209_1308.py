# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0011_feedbackdigest_delivery_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbacksubmission',
            name='could_improve_was_helpful',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='feedbacksubmission',
            name='excels_at_was_helpful',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
