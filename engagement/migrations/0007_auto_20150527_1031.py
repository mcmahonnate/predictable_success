# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('engagement', '0006_auto_20150511_1259'),
    ]

    operations = [
        migrations.AlterField(
            model_name='happiness',
            name='assessment',
            field=models.IntegerField(default=0, choices=[(0, b'Not assessed'), (1, b'Very unhappy'), (2, b'Unhappy'), (3, b'Indifferent'), (4, b'Happy'), (5, b'Very happy')]),
            preserve_default=True,
        ),
    ]
