# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0017_add_permissions_to_existing_groups'),
        ('devzones', '0026_auto_20160204_0830'),
    ]

    operations = [
        migrations.CreateModel(
            name='Meeting',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('completed', models.BooleanField(default=False)),
                ('participants', models.ManyToManyField(related_name='+', null=True, to='org.Employee', blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='conversation',
            name='meeting',
            field=models.ForeignKey(related_name='conversations', to='devzones.Meeting', null=True),
            preserve_default=True,
        ),
    ]
