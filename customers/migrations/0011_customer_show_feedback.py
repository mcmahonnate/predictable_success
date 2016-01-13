# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0010_customer_show_shareable_checkins'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='show_feedback',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
