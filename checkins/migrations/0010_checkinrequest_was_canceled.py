# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '0009_auto_20160115_1142'),
    ]

    operations = [
        migrations.AddField(
            model_name='checkinrequest',
            name='was_canceled',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
