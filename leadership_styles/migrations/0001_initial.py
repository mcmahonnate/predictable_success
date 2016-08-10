# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField(default=b'', blank=True)),
                ('leadership_style', models.IntegerField(choices=[(0, b'Visionary'), (1, b'Operator'), (2, b'Processor'), (3, b'Synergist')])),
                ('order', models.IntegerField(default=0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='EmployeeLeadershipStyle',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('times_retaken', models.IntegerField(default=0)),
                ('notes', models.TextField(default=b'', blank=True)),
                ('is_draft', models.BooleanField(default=False)),
                ('active', models.BooleanField(default=False)),
                ('completed', models.BooleanField(default=False)),
                ('visionary_score', models.IntegerField()),
                ('operator_score', models.IntegerField()),
                ('processor_score', models.IntegerField()),
                ('synergist_score', models.IntegerField()),
                ('answers', models.ManyToManyField(related_name='+', null=True, to='leadership_styles.Answer', blank=True)),
                ('assessor', models.ForeignKey(related_name='+', to='org.Employee')),
                ('employee', models.ForeignKey(related_name='employee_leadership_styles', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField()),
                ('randomize_answers', models.BooleanField(default=False)),
                ('randomize_next_questions', models.BooleanField(default=False)),
                ('order', models.IntegerField(default=0)),
                ('previous_question', models.ForeignKey(related_name='next_questions', blank=True, to='leadership_styles.Question', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='employeeleadershipstyle',
            name='last_question_answered',
            field=models.ForeignKey(related_name='+', blank=True, to='leadership_styles.Question', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(related_name='_answers', to='leadership_styles.Question', null=True),
            preserve_default=True,
        ),
    ]
