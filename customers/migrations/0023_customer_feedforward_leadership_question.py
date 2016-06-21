# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0022_auto_20160613_1335'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='feedforward_leadership_question',
            field=models.TextField(default=b'If you consider this person to be a leader, what is one thing they could do to help you do your job better?'),
            preserve_default=True,
        ),
    ]
