# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('preferences', '0008_auto_20150806_1403'),
    ]

    operations = [
        migrations.AddField(
            model_name='userpreferences',
            name='show_checkin_intro_pop',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='userpreferences',
            name='show_devzone_intro_pop',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='userpreferences',
            name='show_feedback_intro_pop',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='userpreferences',
            name='show_strengths_intro_pop',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
