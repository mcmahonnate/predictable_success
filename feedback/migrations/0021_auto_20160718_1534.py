# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0020_auto_20160621_1016'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbackrequest',
            name='was_declined_reason',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='feedbacksubmission',
            name='choose_not_to_deliver',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='feedbacksubmission',
            name='choose_not_to_deliver_reason',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
    ]
