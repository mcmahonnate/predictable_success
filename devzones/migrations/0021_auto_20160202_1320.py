# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0020_auto_20160202_1310'),
    ]

    operations = [
        migrations.RenameField(
            model_name='zone',
            old_name='description',
            new_name='long_description',
        ),
        migrations.AddField(
            model_name='zone',
            name='short_description',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
    ]
