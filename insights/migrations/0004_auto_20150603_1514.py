# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0003_auto_20150603_1326'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='company',
            field=models.CharField(max_length=64, null=True),
            preserve_default=True,
        ),
    ]
