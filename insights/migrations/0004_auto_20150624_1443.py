# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0003_auto_20150611_1428'),
    ]

    operations = [
        migrations.AlterField(
            model_name='prospect',
            name='talent_category',
            field=models.IntegerField(null=True, choices=[(6, b"I'm not sure what my future looks like, or if people know about my current contributions."), (5, b'I want to focus on developing skills outside of my current role.'), (2, b'I could use a coach or mentor.'), (3, b"I'd like a challenge."), (1, b"I'd like the freedom to pick work that excites me.")]),
            preserve_default=True,
        ),
    ]
