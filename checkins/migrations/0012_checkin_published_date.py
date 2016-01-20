# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '0011_checkin_shareable'),
    ]

    operations = [
        migrations.AddField(
            model_name='checkin',
            name='published_date',
            field=models.DateTimeField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
