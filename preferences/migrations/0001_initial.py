# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sites', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SitePreferences',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('show_kolbe', models.BooleanField()),
                ('show_vops', models.BooleanField()),
                ('show_mbti', models.BooleanField()),
                ('show_coaches', models.BooleanField()),
                ('site', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, blank=True, to='sites.Site')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
