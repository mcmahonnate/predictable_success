# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devzones', '0016_employeezone_assessor'),
    ]

    operations = [
        migrations.RenameField(
            model_name='advice',
            old_name='description',
            new_name='advice_description_for_development_leader',
        ),
        migrations.RemoveField(
            model_name='advice',
            name='name',
        ),
        migrations.AddField(
            model_name='advice',
            name='advice_description_for_employee',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='advice',
            name='advice_name_for_development_leader',
            field=models.CharField(default=b'', max_length=255, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='advice',
            name='advice_name_for_employee',
            field=models.CharField(default=b'', max_length=255, blank=True),
            preserve_default=True,
        ),
    ]
