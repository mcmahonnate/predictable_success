# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0017_add_permissions_to_existing_groups'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('owners', models.ManyToManyField(related_name='projects_owned', to='org.Employee')),
                ('sponsors', models.ManyToManyField(related_name='projects_sponsored', to='org.Employee')),
                ('team_members', models.ManyToManyField(related_name='projects_team_member', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
