# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0009_relationship'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='employee',
            options={'permissions': (('view_employees', 'Can view employees'), ('create_employee_comments', 'Can create comments on employees'), ('view_employee_comments', 'Can view comments on employees'))},
        ),
        migrations.AddField(
            model_name='employee',
            name='is_coach',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='is_lead',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
