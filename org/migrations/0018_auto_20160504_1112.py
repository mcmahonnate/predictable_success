# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0017_add_permissions_to_existing_groups'),
    ]

    operations = [
        migrations.RenameField(
            model_name='employee',
            old_name='linkedin_id',
            new_name='namely_id',
        ),
    ]
