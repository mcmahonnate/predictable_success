# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0008_auto_20150603_1530'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='access_token',
            field=models.CharField(max_length=32, null=True),
            preserve_default=True,
        ),
    ]
