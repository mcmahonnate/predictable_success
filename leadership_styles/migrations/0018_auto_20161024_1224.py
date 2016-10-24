# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0017_quizurl_last_reminder_sent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quizurl',
            name='sent_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
