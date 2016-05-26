# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0020_auto_20160504_1158'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='yei_api_token',
            field=models.CharField(max_length=255, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='customer',
            name='yei_api_url',
            field=models.CharField(max_length=255, blank=True),
            preserve_default=True,
        ),
    ]
