# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0012_employeezone_completed'),
    ]

    operations = [
        migrations.AddField(
            model_name='zone',
            name='tie_breaker',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
