# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0004_auto_20150430_1522'),
    ]

    operations = [
        migrations.AlterField(
            model_name='team',
            name='leader',
            field=models.OneToOneField(related_name='+', null=True, blank=True, to='org.Employee'),
            preserve_default=True,
        ),
    ]
