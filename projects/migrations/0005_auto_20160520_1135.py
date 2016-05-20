# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0004_auto_20160126_1431'),
    ]

    operations = [
        migrations.CreateModel(
            name='ScoringCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='scoringoption',
            name='name',
        ),
        migrations.AddField(
            model_name='scoringcriteria',
            name='category',
            field=models.ForeignKey(related_name='criteria', to='projects.ScoringCategory', null=True),
            preserve_default=True,
        ),
    ]
