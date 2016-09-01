# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0006_employeeleadershipstyle_quiz_url'),
    ]

    operations = [
        migrations.CreateModel(
            name='LeadershipStyleDescription',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('style', models.IntegerField(choices=[(0, b'Visionary'), (1, b'Operator'), (2, b'Processor'), (3, b'Synergist')])),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Score',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('trait', models.IntegerField(choices=[(0, b'Dominant'), (1, b'Primary'), (2, b'Secondary'), (3, b'Inactive')])),
                ('style', models.IntegerField(choices=[(0, b'Visionary'), (1, b'Operator'), (2, b'Processor'), (3, b'Synergist')])),
                ('score', models.IntegerField()),
            ],
        ),
        migrations.RemoveField(
            model_name='employeeleadershipstyle',
            name='operator_score',
        ),
        migrations.RemoveField(
            model_name='employeeleadershipstyle',
            name='processor_score',
        ),
        migrations.RemoveField(
            model_name='employeeleadershipstyle',
            name='synergist_score',
        ),
        migrations.RemoveField(
            model_name='employeeleadershipstyle',
            name='visionary_score',
        ),
        migrations.AddField(
            model_name='employeeleadershipstyle',
            name='scores',
            field=models.ManyToManyField(related_name='+', null=True, to='leadership_styles.Score', blank=True),
        ),
    ]
