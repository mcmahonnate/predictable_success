# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0008_customer_activation_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='show_individual_comp',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
