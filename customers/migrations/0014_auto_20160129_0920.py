# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0013_auto_20160117_2012'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='devzones_welcome',
            field=models.TextField(default=b'Welcome to Development Zones, this is the place to let us know where you think you are on your development path. The information you share here will be used to help us find ways to help you on your professional development. &mdash;The Scoutmap Team'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='customer',
            name='show_devzones',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
