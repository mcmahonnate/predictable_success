# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0024_auto_20160706_1609'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='coachcapacity',
            name='employee',
        ),
        migrations.DeleteModel(
            name='CoachCapacity',
        ),
    ]
