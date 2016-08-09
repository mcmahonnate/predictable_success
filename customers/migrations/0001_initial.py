# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import tenant_schemas.postgresql_backend.base


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('domain_url', models.CharField(unique=True, max_length=128)),
                ('schema_name', models.CharField(unique=True, max_length=63, validators=[tenant_schemas.postgresql_backend.base._check_schema_name])),
                ('name', models.CharField(max_length=100)),
                ('namely_api_url', models.CharField(max_length=255, blank=True)),
                ('namely_api_token', models.CharField(max_length=255, blank=True)),
                ('slack_url', models.CharField(max_length=255, blank=True)),
                ('slack_api_url', models.CharField(max_length=255, blank=True)),
                ('slack_api_token', models.CharField(max_length=255, blank=True)),
                ('slack_bot', models.CharField(max_length=255, blank=True)),
                ('created_on', models.DateField(auto_now_add=True)),
                ('show_individual_comp', models.BooleanField(default=True)),
                ('show_qualities', models.BooleanField(default=False)),
                ('activation_email', models.TextField(default=b'Welcome to Scoutmap!')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
    ]
