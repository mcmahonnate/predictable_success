# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0029_auto_20160210_1603'),
    ]

    operations = [
        migrations.AddField(
            model_name='zone',
            name='must_be_unanimous',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
