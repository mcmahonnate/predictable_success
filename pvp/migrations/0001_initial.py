# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('blah', '0001_initial'),
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EvaluationRound',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateField()),
                ('is_complete', models.BooleanField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PvpDescription',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('potential', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4)])),
                ('performance', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4)])),
                ('description', models.CharField(max_length=255, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PvpEvaluation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('potential', models.IntegerField(default=0, blank=True, choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4)])),
                ('performance', models.IntegerField(default=0, blank=True, choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4)])),
                ('is_complete', models.BooleanField()),
                ('comment', models.ForeignKey(blank=True, to='blah.Comment', null=True)),
                ('employee', models.ForeignKey(related_name='pvp', to='org.Employee')),
                ('evaluation_round', models.ForeignKey(to='pvp.EvaluationRound')),
                ('evaluator', models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'ordering': ['-evaluation_round__date'],
                'verbose_name': 'PVP Evaluation',
                'verbose_name_plural': 'PVP Evaluations',
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='pvpevaluation',
            unique_together=set([('employee', 'evaluation_round')]),
        ),
    ]
