# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0007_auto_20160901_1045'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employeeleadershipstyle',
            name='scores',
            field=models.ManyToManyField(related_name='employee_leadership_style', null=True, to='leadership_styles.Score', blank=True),
        ),
    ]
