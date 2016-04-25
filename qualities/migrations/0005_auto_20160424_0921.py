# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('qualities', '0004_populate_qualities_20151215'),
    ]

    operations = [
        migrations.AddField(
            model_name='perceptionrequest',
            name='category',
            field=models.ForeignKey(to='qualities.QualityCluster', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='perceptionrequest',
            name='message',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='perceivedquality',
            name='perception_request',
            field=models.ForeignKey(related_name='submission', blank=True, to='qualities.PerceptionRequest', null=True),
            preserve_default=True,
        ),
    ]
