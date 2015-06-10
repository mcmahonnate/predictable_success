# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0011_auto_20150603_1749'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='uid',
            field=models.CharField(max_length=8, null=True),
            preserve_default=True,
        ),
    ]
