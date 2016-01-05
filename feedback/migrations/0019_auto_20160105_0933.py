# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0018_auto_20151228_1040'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feedbackhelpful',
            name='helpfulness',
            field=models.IntegerField(default=0, choices=[(0, b'Not assessed'), (1, b'Somewhat helpful'), (2, b'Helpful'), (3, b'Very helpful')]),
            preserve_default=True,
        ),
    ]
