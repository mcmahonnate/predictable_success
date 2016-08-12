# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0002_auto_20160811_0925'),
    ]

    operations = [
        migrations.AddField(
            model_name='employeeleadershipstyle',
            name='assessment_type',
            field=models.IntegerField(default=0, choices=[(0, b'Self Assessment'), (1, b'360 Assessment')]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='question',
            name='active',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='question',
            name='assessment_type',
            field=models.IntegerField(default=0, choices=[(0, b'Self Assessment'), (1, b'360 Assessment')]),
            preserve_default=False,
        ),
    ]
