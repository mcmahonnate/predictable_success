# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0004_feedbackrequest_was_declined'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='feedbacksubmission',
            name='confidentiality',
        ),
        migrations.AddField(
            model_name='feedbacksubmission',
            name='anonymous',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
