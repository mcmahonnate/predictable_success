# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0019_auto_20160504_1152'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customer',
            old_name='namely_api_uri',
            new_name='namely_api_url',
        ),
    ]
