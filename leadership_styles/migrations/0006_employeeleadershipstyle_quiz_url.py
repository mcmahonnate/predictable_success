# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0005_quizurl'),
    ]

    operations = [
        migrations.AddField(
            model_name='employeeleadershipstyle',
            name='quiz_url',
            field=models.ForeignKey(related_name='employee_leadership_style', blank=True, to='leadership_styles.QuizUrl', null=True),
        ),
    ]
