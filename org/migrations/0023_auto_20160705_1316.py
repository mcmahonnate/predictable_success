# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0022_coachprofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coachprofile',
            name='blacklist',
            field=models.ManyToManyField(related_name='blacklisted_by', null=True, to='org.Employee', blank=True),
            preserve_default=True,
        ),
    ]
