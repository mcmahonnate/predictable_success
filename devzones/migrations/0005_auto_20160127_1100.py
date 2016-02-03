# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0004_auto_20160127_1059'),
    ]

    operations = [
        migrations.RenameField(
            model_name='answer',
            old_name='next_questions',
            new_name='next_question',
        ),
    ]
