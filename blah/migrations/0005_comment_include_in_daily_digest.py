# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blah', '0004_remove_comment_include_in_daily_digest'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='include_in_daily_digest',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
