# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0018_auto_20160418_1126'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='namely_api_token',
            field=models.CharField(max_length=255, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='customer',
            name='namely_api_uri',
            field=models.CharField(max_length=255, blank=True),
            preserve_default=True,
        ),
    ]
