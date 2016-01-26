# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0012_customer_checkin_welcome'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='projects_welcome',
            field=models.TextField(default=b"Welcome, we hope you like our new projects feature. It's a safe place to ask for help from your Coach or Team Lead. The best part is, it's just between you and them. &mdash;The Scoutmap Team"),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='customer',
            name='show_projects',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
