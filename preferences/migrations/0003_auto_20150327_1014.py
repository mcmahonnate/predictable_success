# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('preferences', '0002_auto_20150309_0836'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitepreferences',
            name='survey_email_body',
            field=models.TextField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='sitepreferences',
            name='survey_email_subject',
            field=models.TextField(default=False),
            preserve_default=True,
        ),
    ]
