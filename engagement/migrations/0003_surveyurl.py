# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0002_employee_linkedin_id'),
        ('engagement', '0002_happiness_comment'),
    ]

    operations = [
        migrations.CreateModel(
            name='SurveyUrl',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('url', models.CharField(max_length=255, null=True, blank=True)),
                ('active', models.BooleanField()),
                ('sent_date', models.DateField(auto_now_add=True)),
                ('sent_to', models.ForeignKey(related_name='+', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
