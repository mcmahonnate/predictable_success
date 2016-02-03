# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0019_auto_20160202_1304'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conversation',
            name='development_lead',
            field=models.ForeignKey(related_name='people_ive_had_development_conversations_about', to='org.Employee'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='conversation',
            name='development_lead_assessment',
            field=models.OneToOneField(related_name='+', null=True, blank=True, to='devzones.EmployeeZone'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='conversation',
            name='employee_assessment',
            field=models.OneToOneField(related_name='development_conversation', null=True, blank=True, to='devzones.EmployeeZone'),
            preserve_default=True,
        ),
    ]
