# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CheckInType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=100)),
                ('sort_weight', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='checkin',
            name='other_type_description',
            field=models.CharField(max_length=100, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='checkin',
            name='type',
            field=models.ForeignKey(related_name='+', to='checkins.CheckInType', null=True),
            preserve_default=True,
        ),
    ]
