# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0023_auto_20160705_1316'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mentorship',
            name='mentee',
        ),
        migrations.RemoveField(
            model_name='mentorship',
            name='mentor',
        ),
        migrations.DeleteModel(
            name='Mentorship',
        ),
    ]
