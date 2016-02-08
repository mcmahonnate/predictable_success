# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0014_auto_20150918_1036'),
    ]

    operations = [
        migrations.CreateModel(
            name='PerceivedQualities',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('perception_date', models.DateTimeField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Quality',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, blank=True)),
                ('description', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='QualityCluster',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, blank=True)),
                ('min_choice', models.IntegerField(default=0)),
                ('max_choice', models.IntegerField(default=0)),
                ('qualities', models.ManyToManyField(to='qualities.Quality')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='perceivedqualities',
            name='cluster',
            field=models.ForeignKey(related_name='+', to='qualities.QualityCluster'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='perceivedqualities',
            name='qualities',
            field=models.ManyToManyField(to='qualities.Quality'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='perceivedqualities',
            name='reviewer',
            field=models.ForeignKey(related_name='+', to='org.Employee'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='perceivedqualities',
            name='subject',
            field=models.ForeignKey(related_name='+', to='org.Employee'),
            preserve_default=True,
        ),
    ]
