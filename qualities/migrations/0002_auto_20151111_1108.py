# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0017_add_permissions_to_existing_groups'),
        ('qualities', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PerceivedQuality',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('perception_date', models.DateTimeField(auto_now_add=True)),
                ('cluster', models.ForeignKey(related_name='+', to='qualities.QualityCluster')),
                ('quality', models.ForeignKey(related_name='+', to='qualities.Quality')),
                ('reviewer', models.ForeignKey(related_name='+', to='org.Employee')),
                ('subject', models.ForeignKey(related_name='+', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='perceivedqualities',
            name='cluster',
        ),
        migrations.RemoveField(
            model_name='perceivedqualities',
            name='qualities',
        ),
        migrations.RemoveField(
            model_name='perceivedqualities',
            name='reviewer',
        ),
        migrations.RemoveField(
            model_name='perceivedqualities',
            name='subject',
        ),
        migrations.DeleteModel(
            name='PerceivedQualities',
        ),
    ]
