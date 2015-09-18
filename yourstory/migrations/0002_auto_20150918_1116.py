# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('yourstory', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='yourstory',
            name='a9',
            field=models.ForeignKey(related_name='+', to='yourstory.EmployeeChoiceResponse', null=True),
            preserve_default=True,
        ),
    ]
