# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import feedback.models


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0008_auto_20151016_1024'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbackrequest',
            name='was_responded_to',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='feedbackrequest',
            name='expiration_date',
            field=models.DateField(default=feedback.models.default_feedback_request_expiration_date, null=True, blank=True),
            preserve_default=True,
        ),
    ]
