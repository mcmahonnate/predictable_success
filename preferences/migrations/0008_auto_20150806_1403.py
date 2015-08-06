# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('preferences', '0007_sitepreferences'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sitepreferences',
            name='site',
        ),
        migrations.DeleteModel(
            name='SitePreferences',
        ),
    ]
