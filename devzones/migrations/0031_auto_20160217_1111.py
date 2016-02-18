# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0030_zone_must_be_unanimous'),
    ]

    operations = [
        migrations.RenameField(
            model_name='zone',
            old_name='value',
            new_name='order',
        ),
    ]
