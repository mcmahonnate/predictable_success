# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0016_auto_20161004_0933'),
    ]

    operations = [
        migrations.AddField(
            model_name='quizurl',
            name='last_reminder_sent',
            field=models.DateTimeField(null=True, blank=True),
        ),
    ]
