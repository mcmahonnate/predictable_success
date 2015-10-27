# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0010_auto_20151020_1046'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbackdigest',
            name='delivery_date',
            field=models.DateTimeField(null=True),
            preserve_default=True,
        ),
    ]
