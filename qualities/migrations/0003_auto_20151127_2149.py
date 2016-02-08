# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import qualities.models


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0017_add_permissions_to_existing_groups'),
        ('qualities', '0002_auto_20151111_1108'),
    ]

    operations = [
        migrations.CreateModel(
            name='PerceptionRequest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('request_date', models.DateTimeField(auto_now_add=True)),
                ('expiration_date', models.DateField(default=qualities.models.default_perception_request_expiration_date, null=True, blank=True)),
                ('was_declined', models.BooleanField(default=False)),
                ('was_responded_to', models.BooleanField(default=False)),
                ('requester', models.ForeignKey(related_name='perception_requests', to='org.Employee')),
                ('reviewer', models.ForeignKey(related_name='requests_for_perception', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='perceivedquality',
            name='perception_request',
            field=models.ForeignKey(related_name='qualities', blank=True, to='qualities.PerceptionRequest', null=True),
            preserve_default=True,
        ),
    ]
