# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0011_auto_20160914_1427'),
    ]

    operations = [
        migrations.AddField(
            model_name='teamleadershipstyle',
            name='customer_id',
            field=models.CharField(default=0, max_length=255),
            preserve_default=False,
        ),
    ]
