# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0010_employee_team_tead'),
    ]

    operations = [
        migrations.RenameField(
            model_name='employee',
            old_name='team_tead',
            new_name='team_lead',
        ),
    ]
