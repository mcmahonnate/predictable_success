# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '0014_checkin_visible_to_employee_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='checkinrequest',
            name='message',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
    ]
