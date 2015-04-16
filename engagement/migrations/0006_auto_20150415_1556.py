# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('engagement', '0005_auto_20150304_0937'),
    ]

    operations = [
        migrations.AlterField(
            model_name='happiness',
            name='comment',
            field=models.ForeignKey(related_name='happiness', blank=True, to='blah.Comment', null=True),
            preserve_default=True,
        ),
    ]
