# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0012_auto_20151209_1308'),
    ]

    operations = [
        migrations.RenameField(
            model_name='feedbacksubmission',
            old_name='could_improve_was_helpful',
            new_name='could_improve_on_was_helpful',
        ),
    ]
