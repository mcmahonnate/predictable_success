# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0015_merge'),
        ('feedback', '0007_remove_feedbackrequest_is_complete'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='feedbackdigest',
            name='coach',
        ),
        migrations.AddField(
            model_name='feedbackdigest',
            name='delivered_by',
            field=models.ForeignKey(related_name='+', to='org.Employee', null=True),
            preserve_default=True,
        ),
    ]
