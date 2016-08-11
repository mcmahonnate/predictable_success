# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employeeleadershipstyle',
            name='operator_score',
            field=models.IntegerField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='employeeleadershipstyle',
            name='processor_score',
            field=models.IntegerField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='employeeleadershipstyle',
            name='synergist_score',
            field=models.IntegerField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='employeeleadershipstyle',
            name='visionary_score',
            field=models.IntegerField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
