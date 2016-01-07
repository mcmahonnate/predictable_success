# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0009_customer_show_individual_comp'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='show_shareable_checkins',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
