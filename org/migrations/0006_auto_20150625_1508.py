# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0005_auto_20150430_1523'),
    ]

    operations = [
        migrations.AlterField(
            model_name='leadership',
            name='leader',
            field=models.ForeignKey(related_name='+', blank=True, to='org.Employee', null=True),
            preserve_default=True,
        ),
    ]
