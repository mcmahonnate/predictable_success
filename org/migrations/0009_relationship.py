# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0008_merge'),
    ]

    operations = [
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
    ]
