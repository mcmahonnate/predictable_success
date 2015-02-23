# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Attribute',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AttributeCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('full_name', models.CharField(max_length=255)),
                ('first_name', models.CharField(max_length=255, null=True, blank=True)),
                ('last_name', models.CharField(max_length=255, null=True, blank=True)),
                ('avatar', models.ImageField(default=b'/media/avatars/geneRick.jpg', upload_to=b'media/avatars/%Y/%m/%d', blank=True)),
                ('avatar_small', models.ImageField(default=b'/media/avatars/small/geneRick.jpeg', null=True, upload_to=b'media/avatars/small/%Y/%m/%d', blank=True)),
                ('job_title', models.CharField(max_length=255, blank=True)),
                ('email', models.CharField(max_length=255, blank=True)),
                ('hire_date', models.DateField(null=True)),
                ('departure_date', models.DateField(default=None, null=True, blank=True)),
                ('display', models.BooleanField()),
                ('coach', models.ForeignKey(related_name='coachee', blank=True, to='org.Employee', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Leadership',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_date', models.DateField(default=datetime.date.today)),
                ('end_date', models.DateField(null=True, blank=True)),
                ('employee', models.ForeignKey(related_name='leaderships', to='org.Employee')),
                ('leader', models.ForeignKey(related_name='+', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Mentorship',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('mentee', models.ForeignKey(related_name='+', to='org.Employee')),
                ('mentor', models.ForeignKey(related_name='+', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('leader', models.OneToOneField(related_name='+', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='employee',
            name='team',
            field=models.ForeignKey(default=None, blank=True, to='org.Team', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='user',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, blank=True, to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='attribute',
            name='category',
            field=models.ForeignKey(default=None, blank=True, to='org.AttributeCategory', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='attribute',
            name='employee',
            field=models.ForeignKey(related_name='attributes', to='org.Employee'),
            preserve_default=True,
        ),
    ]
