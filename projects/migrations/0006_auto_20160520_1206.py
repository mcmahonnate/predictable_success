# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0005_auto_20160520_1135'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='prioritizationrule',
            name='criteria',
        ),
        migrations.AddField(
            model_name='prioritizationrule',
            name='categories',
            field=models.ManyToManyField(related_name='rules', to='projects.ScoringCategory'),
            preserve_default=True,
        ),
    ]
