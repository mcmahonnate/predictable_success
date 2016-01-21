# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '0013_checkin_sent_publish_reminder'),
    ]

    operations = [
        migrations.AddField(
            model_name='checkin',
            name='visible_to_employee_date',
            field=models.DateTimeField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
