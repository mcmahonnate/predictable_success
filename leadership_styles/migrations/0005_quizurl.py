# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0004_auto_20160815_1207'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuizUrl',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email', models.CharField(max_length=255)),
                ('url', models.CharField(max_length=255, null=True, blank=True)),
                ('active', models.BooleanField(default=True)),
                ('completed', models.BooleanField(default=False)),
                ('sent_date', models.DateField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
