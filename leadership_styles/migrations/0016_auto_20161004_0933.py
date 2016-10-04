# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0015_leadershipstyledescription'),
    ]

    operations = [
        migrations.AddField(
            model_name='teamleadershipstyle',
            name='received_report',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='teamleadershipstyle',
            name='requested_date',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='teamleadershipstyle',
            name='requested_report',
            field=models.BooleanField(default=False),
        ),
    ]
