# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '0012_checkin_published_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='checkin',
            name='sent_publish_reminder',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
