# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blah', '0001_initial'),
        ('engagement', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='happiness',
            name='comment',
            field=models.ForeignKey(blank=True, to='blah.Comment', null=True),
            preserve_default=True,
        ),
    ]
