# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0022_auto_20160202_1512'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='conversation',
            name='employee',
        ),
    ]
