# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0006_auto_20150625_1508'),
    ]

    operations = [
        migrations.AddField(
            model_name='attributecategory',
            name='display',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
