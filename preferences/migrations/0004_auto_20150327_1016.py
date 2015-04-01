# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('preferences', '0003_auto_20150327_1014'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sitepreferences',
            name='survey_email_body',
            field=models.TextField(),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='sitepreferences',
            name='survey_email_subject',
            field=models.TextField(),
            preserve_default=True,
        ),
    ]
