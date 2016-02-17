# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0015_customer_devzones_id_session_intro'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='show_qualities',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
