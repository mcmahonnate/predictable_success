# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0017_add_permissions_to_existing_groups'),
        ('devzones', '0015_auto_20160202_1133'),
    ]

    operations = [
        migrations.AddField(
            model_name='employeezone',
            name='assessor',
            field=models.ForeignKey(related_name='+', default=1, to='org.Employee'),
            preserve_default=False,
        ),
    ]
