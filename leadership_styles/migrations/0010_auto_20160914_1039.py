# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0002_auto_20160829_1504'),
        ('leadership_styles', '0009_auto_20160902_1338'),
    ]

    operations = [
        migrations.CreateModel(
            name='TeamLeadershipStyle',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('owner', models.ForeignKey(related_name='+', to='org.Employee')),
                ('quiz_requests', models.ManyToManyField(related_name='+', null=True, to='leadership_styles.QuizUrl', blank=True)),
                ('team_members', models.ManyToManyField(related_name='+', null=True, to='org.Employee', blank=True)),
            ],
        ),
        migrations.AlterField(
            model_name='employeeleadershipstyle',
            name='employee',
            field=models.OneToOneField(related_name='leadership_style', to='org.Employee'),
        ),
    ]
