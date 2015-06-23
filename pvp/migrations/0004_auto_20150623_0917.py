# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pvp', '0003_pvpevaluation_too_new'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pvpdescription',
            name='description',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
    ]
