# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import qualities.models


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PerceivedQuality',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('perception_date', models.DateTimeField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PerceptionRequest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('expiration_date', models.DateField(default=qualities.models.default_perception_request_expiration_date, null=True, blank=True)),
                ('message', models.TextField(blank=True)),
                ('request_date', models.DateTimeField(auto_now_add=True)),
                ('was_declined', models.BooleanField(default=False)),
                ('was_responded_to', models.BooleanField(default=False)),
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
                ('qualities', models.ManyToManyField(related_name='clusters', to='qualities.Quality')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='perceptionrequest',
            name='category',
            field=models.ForeignKey(to='qualities.QualityCluster', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='perceptionrequest',
            name='requester',
            field=models.ForeignKey(related_name='perception_requests', to='org.Employee'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='perceptionrequest',
            name='reviewer',
            field=models.ForeignKey(related_name='requests_for_perception', to='org.Employee'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='perceivedquality',
            name='cluster',
            field=models.ForeignKey(related_name='+', to='qualities.QualityCluster'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='perceivedquality',
            name='perception_request',
            field=models.ForeignKey(related_name='submission', blank=True, to='qualities.PerceptionRequest', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='perceivedquality',
            name='quality',
            field=models.ForeignKey(related_name='+', to='qualities.Quality'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='perceivedquality',
            name='reviewer',
            field=models.ForeignKey(related_name='+', to='org.Employee'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='perceivedquality',
            name='subject',
            field=models.ForeignKey(related_name='+', to='org.Employee'),
            preserve_default=True,
        ),
    ]
