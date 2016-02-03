# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0017_add_permissions_to_existing_groups'),
        ('devzones', '0023_remove_conversation_employee'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='conversation',
            name='employee_assessment',
        ),
        migrations.AddField(
            model_name='conversation',
            name='employee',
            field=models.ForeignKey(related_name='development_conversations', default=1392, to='org.Employee'),
            preserve_default=False,
        ),
    ]
