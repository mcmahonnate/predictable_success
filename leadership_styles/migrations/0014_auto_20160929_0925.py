# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0013_quizurl_invited_by'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='LeadershipStyleDescription',
            new_name='LeadershipStyleTease',
        ),
        migrations.RenameField(
            model_name='leadershipstyletease',
            old_name='description',
            new_name='tease',
        ),
    ]
