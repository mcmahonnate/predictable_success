# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('preferences', '0004_auto_20150327_1016'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sitepreferences',
            name='survey_email_subject',
            field=models.CharField(max_length=255, blank=True),
            preserve_default=True,
        ),
    ]
