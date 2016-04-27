# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('activity', '0018_event_show_conversation'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='event',
            options={'permissions': (('receive_daily_digest', 'Receive daily digest of events'),)},
        ),
    ]
