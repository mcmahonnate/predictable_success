# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('engagement', '0006_auto_20150415_1556'),
    ]

    operations = [
        migrations.AlterField(
            model_name='happiness',
            name='comment',
            field=models.OneToOneField(related_name='happiness', null=True, blank=True, to='blah.Comment'),
            preserve_default=True,
        ),
    ]
