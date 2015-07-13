# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('checkins', '__first__'),
        ('todo', '0005_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='checkin',
            field=models.ForeignKey(related_name='tasks', blank=True, to='checkins.CheckIn', null=True),
            preserve_default=True,
        ),
    ]
