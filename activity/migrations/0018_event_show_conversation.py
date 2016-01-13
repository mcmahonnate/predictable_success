# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('activity', '0017_auto_20151110_1332'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='show_conversation',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
