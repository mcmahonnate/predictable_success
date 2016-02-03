# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0017_add_permissions_to_existing_groups'),
        ('devzones', '0014_employeezone_notes'),
    ]

    operations = [
        migrations.CreateModel(
            name='Advice',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(default=b'', blank=True)),
                ('development_lead_zone', models.ForeignKey(related_name='+', to='devzones.Zone')),
                ('employee_zone', models.ForeignKey(related_name='+', to='devzones.Zone')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('development_lead', models.ForeignKey(related_name='people_Ive_had_development_conversations_about', to='org.Employee')),
                ('development_lead_assessment', models.ForeignKey(related_name='+', blank=True, to='devzones.EmployeeZone', null=True)),
                ('employee', models.ForeignKey(related_name='development_conversations', to='org.Employee')),
                ('employee_assessment', models.ForeignKey(related_name='+', blank=True, to='devzones.EmployeeZone', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='employeezone',
            name='employee',
            field=models.ForeignKey(related_name='development_zones', to='org.Employee'),
            preserve_default=True,
        ),
    ]
