# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('engagement', '0007_auto_20150527_1031'),
        ('org', '0006_auto_20150625_1508'),
    ]

    operations = [
        migrations.CreateModel(
            name='CheckIn',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateTimeField()),
                ('summary', models.TextField()),
                ('employee', models.ForeignKey(related_name='checkins', to='org.Employee')),
                ('happiness', models.ForeignKey(blank=True, to='engagement.Happiness', null=True)),
                ('host', models.ForeignKey(related_name='checkins_hosted', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
