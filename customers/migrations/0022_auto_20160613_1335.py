# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0021_auto_20160526_1028'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='slack_api_token',
            field=models.CharField(max_length=255, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='customer',
            name='slack_api_url',
            field=models.CharField(max_length=255, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='customer',
            name='slack_bot',
            field=models.CharField(max_length=255, blank=True),
            preserve_default=True,
        ),
    ]
