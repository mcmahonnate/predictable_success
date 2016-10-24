# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0002_auto_20160829_1504'),
        ('leadership_styles', '0018_auto_20161024_1224'),
    ]

    operations = [
        migrations.CreateModel(
            name='TeamAnalysisFollowUp',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('employee', models.ForeignKey(related_name='+', to='org.Employee')),
            ],
        ),
    ]
