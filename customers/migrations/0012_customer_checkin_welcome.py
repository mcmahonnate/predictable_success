# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0011_customer_show_feedback'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='checkin_welcome',
            field=models.TextField(default=b"Welcome, we hope you like our new checkin feature. It's a safe place to ask for help from your Coach or Team Lead. The best part is, it's just between you and them. &mdash;The Scoutmap Team"),
            preserve_default=True,
        ),
    ]
