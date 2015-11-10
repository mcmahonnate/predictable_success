# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0005_auto_20151110_1327'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='feedback_welcome',
            field=models.TextField(default=b"Welcome, we hope you like our new feedback app. It's a safe place to ask for and give feedback. You can do it whenever, with whomever, and about whatever you'd like. The best part is, it's just between you and your coach. &mdash;The Scoutmap Team"),
            preserve_default=True,
        ),
    ]
