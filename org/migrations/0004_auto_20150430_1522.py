# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0003_auto_20150430_1000'),
    ]

    operations = [
        migrations.AlterField(
            model_name='team',
            name='leader',
            field=models.OneToOneField(related_name='+', null=True, to='org.Employee'),
            preserve_default=True,
        ),
    ]
