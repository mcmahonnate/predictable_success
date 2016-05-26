# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0020_employee_yei_id'),
        ('activity', '0019_auto_20160426_1219'),
    ]

    operations = [
        migrations.CreateModel(
            name='ThirdParty',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('url', models.CharField(max_length=255)),
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
