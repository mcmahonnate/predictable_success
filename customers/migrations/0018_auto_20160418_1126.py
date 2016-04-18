# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0017_auto_20160418_1119'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='devzone_selfie_email_subject',
            field=models.CharField(default=b'Scoutmap ID Modeling in 4 Steps', max_length=255),
            preserve_default=True,
        ),
    ]
