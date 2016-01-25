# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '0010_checkinrequest_was_canceled'),
    ]

    operations = [
        migrations.AddField(
            model_name='checkin',
            name='shareable',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
