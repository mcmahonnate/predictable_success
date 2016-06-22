# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0021_employee_slack_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='CoachProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('max_allowed_coachees', models.IntegerField(default=0)),
                ('approach', models.TextField(default=b'', blank=True)),
                ('blacklist', models.ManyToManyField(related_name='+', null=True, to='org.Employee', blank=True)),
                ('employee', models.ForeignKey(related_name='coaching_profile', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
