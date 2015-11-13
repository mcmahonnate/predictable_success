# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0007_customer_feedback_tips'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='activation_email',
            field=models.TextField(default=b'Welcome to Scoutmap!'),
            preserve_default=True,
        ),
    ]
