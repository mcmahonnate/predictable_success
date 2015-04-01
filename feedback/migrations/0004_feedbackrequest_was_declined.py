# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0003_auto_20150326_1508'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbackrequest',
            name='was_declined',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
