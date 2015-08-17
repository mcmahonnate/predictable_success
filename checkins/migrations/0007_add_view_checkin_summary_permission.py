# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '0006_auto_20150722_0033'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='checkin',
            options={'get_latest_by': 'date', 'permissions': (('view_checkin_summary', 'Can view the summary of the Check In.'),)},
        ),
    ]
