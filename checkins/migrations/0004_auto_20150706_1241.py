# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '0003_auto_20150630_1501'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='checkintype',
            options={'ordering': ['sort_weight']},
        ),
    ]
