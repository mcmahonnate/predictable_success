# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0002_auto_20160829_1504'),
        ('leadership_styles', '0012_teamleadershipstyle_customer_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='quizurl',
            name='invited_by',
            field=models.ForeignKey(related_name='+', blank=True, to='org.Employee', null=True),
        ),
    ]
