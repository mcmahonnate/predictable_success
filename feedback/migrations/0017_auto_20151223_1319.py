# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0017_add_permissions_to_existing_groups'),
        ('feedback', '0016_auto_20151222_1429'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbackhelpful',
            name='given_by',
            field=models.ForeignKey(related_name='helpful_feedback_given', to='org.Employee', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='feedbackhelpful',
            name='received_by',
            field=models.ForeignKey(related_name='helpful_feedback_received', to='org.Employee', null=True),
            preserve_default=True,
        ),
    ]
