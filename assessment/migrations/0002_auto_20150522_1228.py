# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('assessment', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employeeassessment',
            name='employee',
            field=models.ForeignKey(related_name='assessments', to='org.Employee'),
            preserve_default=True,
        ),
    ]
