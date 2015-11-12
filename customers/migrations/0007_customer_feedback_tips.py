# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0006_customer_feedback_welcome'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='feedback_tips',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
    ]
