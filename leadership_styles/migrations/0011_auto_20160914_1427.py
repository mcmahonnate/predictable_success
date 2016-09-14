# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0010_auto_20160914_1039'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teamleadershipstyle',
            name='quiz_requests',
            field=models.ManyToManyField(related_name='team_leadership_styles', null=True, to='leadership_styles.QuizUrl', blank=True),
        ),
        migrations.AlterField(
            model_name='teamleadershipstyle',
            name='team_members',
            field=models.ManyToManyField(related_name='team_leadership_styles', null=True, to='org.Employee', blank=True),
        ),
    ]
