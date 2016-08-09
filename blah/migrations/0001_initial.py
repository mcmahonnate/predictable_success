# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('object_id', models.PositiveIntegerField(verbose_name=b'object id', db_index=True)),
                ('owner_id', models.PositiveIntegerField(db_index=True, null=True, verbose_name=b'owner_id', blank=True)),
                ('content', models.TextField()),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('include_in_daily_digest', models.BooleanField(default=True)),
                ('visibility', models.IntegerField(default=3, choices=[(1, b'Myself'), (2, b'People Team'), (3, b'Everyone')])),
                ('content_type', models.ForeignKey(related_name='content_type', to='contenttypes.ContentType')),
                ('owner_content_type', models.ForeignKey(related_name='owner_content_type', blank=True, to='contenttypes.ContentType', null=True)),
            ],
            options={
                'ordering': ['-created_date'],
            },
            bases=(models.Model,),
        ),
    ]
