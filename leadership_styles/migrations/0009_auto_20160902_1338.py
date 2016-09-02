# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0008_auto_20160901_1052'),
    ]

    operations = [
        migrations.AddField(
            model_name='leadershipstylerequest',
            name='reviewer_email',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='leadershipstylerequest',
            name='reviewer',
            field=models.ForeignKey(related_name='requests_for_leadership_style', blank=True, to='org.Employee', null=True),
        ),
    ]
