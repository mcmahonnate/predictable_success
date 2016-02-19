# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0032_auto_20160219_1057'),
    ]

    operations = [
        migrations.RenameField(
            model_name='advice',
            old_name='alert_for_development_leader',
            new_name='alert_for_development_lead',
        ),
        migrations.RenameField(
            model_name='advice',
            old_name='alert_type_for_development_leader',
            new_name='alert_type_for_development_lead',
        ),
    ]
