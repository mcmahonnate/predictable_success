# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('due_date', models.DateField(null=True, blank=True)),
                ('description', models.CharField(max_length=255, blank=True)),
                ('completed', models.BooleanField()),
                ('assigned_by', models.ForeignKey(related_name='+', blank=True, to='org.Employee', null=True)),
                ('assigned_to', models.ForeignKey(related_name='+', blank=True, to='org.Employee', null=True)),
                ('created_by', models.ForeignKey(related_name='+', to='org.Employee')),
                ('employee', models.ForeignKey(related_name='+', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
