# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0001_initial'),
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('event_id', models.PositiveIntegerField(verbose_name=b'object id', db_index=True)),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('show_conversation', models.BooleanField(default=True)),
                ('employee', models.ForeignKey(related_name='+', to='org.Employee')),
                ('event_type', models.ForeignKey(related_name='event_type', to='contenttypes.ContentType')),
                ('user', models.ForeignKey(related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'permissions': (('receive_daily_digest', 'Receive daily digest of events'),),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ThirdParty',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('url', models.CharField(max_length=255)),
                ('verb', models.CharField(max_length=100, null=True, blank=True)),
                ('image_url', models.CharField(max_length=255, null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ThirdPartyEvent',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('object_id', models.CharField(max_length=255)),
                ('date', models.DateTimeField()),
                ('description', models.TextField(null=True, blank=True)),
                ('employee', models.ForeignKey(related_name='+', to='org.Employee')),
                ('owner', models.ForeignKey(related_name='+', to='org.Employee')),
                ('third_party', models.ForeignKey(related_name='events', to='activity.ThirdParty')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
