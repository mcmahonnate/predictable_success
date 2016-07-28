# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0023_customer_feedforward_leadership_question'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='slack_url',
            field=models.CharField(max_length=255, blank=True),
            preserve_default=True,
        ),
    ]
