# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0017_add_permissions_to_existing_groups'),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField(default=b'', blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='EmployeeZone',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('answers', models.ManyToManyField(related_name='+', to='org.Employee')),
                ('employee', models.ForeignKey(related_name='development_zone', to='org.Employee')),
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
                ('answers', models.ManyToManyField(related_name='question', to='devzones.Answer')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Zone',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(default=b'', blank=True)),
                ('value', models.IntegerField(default=0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='employeezone',
            name='zone',
            field=models.ForeignKey(related_name='+', to='devzones.Zone'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='answer',
            name='next_questions',
            field=models.ForeignKey(related_name='previous_question', to='devzones.Question'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='answer',
            name='zone',
            field=models.ForeignKey(related_name='+', to='devzones.Zone'),
            preserve_default=True,
        ),
    ]
