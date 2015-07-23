# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0001_initial'),
        ('org', '0008_merge'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('event_id', models.PositiveIntegerField(verbose_name=b'object id', db_index=True)),
                ('date', models.DateTimeField(default=datetime.date.today)),
                ('employee', models.ForeignKey(related_name='+', to='org.Employee')),
                ('event_type', models.ForeignKey(related_name='event_type', to='contenttypes.ContentType')),
                ('user', models.ForeignKey(related_name='+', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
