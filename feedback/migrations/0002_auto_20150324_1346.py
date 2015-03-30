# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbacksubmission',
            name='confidentiality',
            field=models.IntegerField(default=0, choices=[(0, b'Quote Me!'), (1, b'Visible to coach, not recipient'), (2, b'Confidential')]),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='feedbackrequest',
            name='is_complete',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='feedbacksubmission',
            name='has_been_delivered',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
