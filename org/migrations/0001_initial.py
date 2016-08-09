# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import mptt.fields
import datetime
import django.db.models.deletion
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
                ('display', models.BooleanField(default=False)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CoachProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('max_allowed_coachees', models.IntegerField(default=0)),
                ('approach', models.TextField(default=b'', blank=True)),
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
                ('gender', models.CharField(blank=True, max_length=1, null=True, choices=[(b'M', b'Male'), (b'F', b'Female')])),
                ('namely_id', models.CharField(max_length=255, null=True, blank=True)),
                ('yei_id', models.CharField(max_length=255, null=True, blank=True)),
                ('slack_name', models.CharField(max_length=255, null=True, blank=True)),
                ('avatar', models.ImageField(default=b'/media/avatars/geneRick.jpg', upload_to=b'media/avatars/%Y/%m/%d', blank=True)),
                ('avatar_small', models.ImageField(default=b'/media/avatars/small/geneRick.jpeg', null=True, upload_to=b'media/avatars/small/%Y/%m/%d', blank=True)),
                ('job_title', models.CharField(max_length=255, blank=True)),
                ('email', models.CharField(max_length=255, blank=True)),
                ('hire_date', models.DateField(null=True)),
                ('departure_date', models.DateField(default=None, null=True, blank=True)),
                ('display', models.BooleanField(default=False)),
                ('lft', models.PositiveIntegerField(editable=False, db_index=True)),
                ('rght', models.PositiveIntegerField(editable=False, db_index=True)),
                ('tree_id', models.PositiveIntegerField(editable=False, db_index=True)),
                ('level', models.PositiveIntegerField(editable=False, db_index=True)),
                ('coach', models.ForeignKey(related_name='coachees', blank=True, to='org.Employee', null=True)),
                ('leader', mptt.fields.TreeForeignKey(related_name='employees', blank=True, to='org.Employee', null=True)),
            ],
            options={
                'permissions': (('view_employees', 'Can view employees'), ('create_employee_comments', 'Can create comments on employees'), ('view_employee_comments', 'Can view comments on employees'), ('view_employees_I_lead', 'Can view employees I lead')),
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
                ('leader', models.ForeignKey(related_name='+', blank=True, to='org.Employee', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Relationship',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('relation_type', models.CharField(max_length=25, choices=[(b'coach', 'Coach'), (b'leader', 'Leader')])),
                ('start_date', models.DateField(default=datetime.date.today)),
                ('end_date', models.DateField(null=True, blank=True)),
                ('employee', models.ForeignKey(related_name='subject_relationships', to='org.Employee')),
                ('related_employee', models.ForeignKey(related_name='object_relationships', to='org.Employee')),
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
                ('leader', models.OneToOneField(related_name='+', null=True, blank=True, to='org.Employee')),
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
            field=models.OneToOneField(related_name='employee', null=True, on_delete=django.db.models.deletion.SET_NULL, blank=True, to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='coachprofile',
            name='blacklist',
            field=models.ManyToManyField(related_name='blacklisted_by', null=True, to='org.Employee', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='coachprofile',
            name='employee',
            field=models.ForeignKey(related_name='coaching_profile', to='org.Employee'),
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
