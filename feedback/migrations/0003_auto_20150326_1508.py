# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0002_auto_20150324_1346'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbacksubmission',
            name='unread',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='feedbacksubmission',
            name='confidentiality',
            field=models.IntegerField(default=0, choices=[(0, b'Anyone can see it'), (1, b'The coach can see it but not the recipient'), (2, b'No one can see it; Please keep it confidential.')]),
            preserve_default=True,
        ),
    ]
