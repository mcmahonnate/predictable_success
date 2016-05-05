# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('comp', '0003_auto_20160105_0933'),
    ]

    operations = [
        migrations.AddField(
            model_name='compensationsummary',
            name='currency_type',
            field=models.CharField(blank=True, max_length=3, null=True, choices=[(b'USD', b'USD'), (b'AUD', b'AUD'), (b'GBP', b'GBP'), (b'CAD', b'CAD'), (b'EUR', b'EUR'), (b'SGP', b'SGP')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='compensationsummary',
            name='date',
            field=models.DateField(null=True),
            preserve_default=True,
        ),
    ]
