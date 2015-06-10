# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0005_auto_20150603_1523'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employee',
            name='engagement',
        ),
        migrations.RemoveField(
            model_name='employee',
            name='talent_category',
        ),
    ]
