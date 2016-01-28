# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0013_zone_tie_breaker'),
    ]

    operations = [
        migrations.AddField(
            model_name='employeezone',
            name='notes',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
    ]
