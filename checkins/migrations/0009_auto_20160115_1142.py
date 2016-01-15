# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0017_add_permissions_to_existing_groups'),
        ('checkins', '0008_auto_20160107_1315'),
    ]

    operations = [
        migrations.CreateModel(
            name='CheckInRequest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('request_date', models.DateTimeField(auto_now_add=True)),
                ('was_responded_to', models.BooleanField(default=False)),
                ('host', models.ForeignKey(related_name='requests_for_checkin', to='org.Employee')),
                ('requester', models.ForeignKey(related_name='checkin_requests', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='checkin',
            name='checkin_request',
            field=models.OneToOneField(related_name='checkin', null=True, blank=True, to='checkins.CheckInRequest'),
            preserve_default=True,
        ),
    ]
