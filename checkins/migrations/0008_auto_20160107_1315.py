# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '0007_add_view_checkin_summary_permission'),
    ]

    operations = [
        migrations.AddField(
            model_name='checkin',
            name='published',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='checkin',
            name='visible_to_employee',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
