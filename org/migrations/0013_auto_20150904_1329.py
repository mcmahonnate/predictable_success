# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0012_add_permissions_to_existing_groups'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employee',
            name='is_coach',
        ),
        migrations.RemoveField(
            model_name='employee',
            name='is_lead',
        ),
    ]
