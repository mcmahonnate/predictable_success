# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sites', '0001_initial'),
        ('preferences', '0006_userpreferences'),
    ]

    operations = [
        migrations.CreateModel(
            name='SitePreferences',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('show_kolbe', models.BooleanField(default=False)),
                ('show_vops', models.BooleanField(default=False)),
                ('show_mbti', models.BooleanField(default=False)),
                ('show_coaches', models.BooleanField(default=False)),
                ('show_timeline', models.BooleanField(default=False)),
                ('survey_email_subject', models.CharField(max_length=255, blank=True)),
                ('survey_email_body', models.TextField()),
                ('site', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, blank=True, to='sites.Site')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
