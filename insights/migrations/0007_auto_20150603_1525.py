# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0006_auto_20150603_1525'),
    ]

    operations = [
        migrations.RenameField(
            model_name='employee',
            old_name='happiness',
            new_name='engagement',
        ),
        migrations.RenameField(
            model_name='employee',
            old_name='talent_cat',
            new_name='talent_category',
        ),
    ]
