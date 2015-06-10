# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0004_auto_20150603_1514'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='happiness',
            field=models.IntegerField(choices=[(1, b'Never been happier! I love coming to work every day.'), (2, b"I'm happy! I like my job, enjoy what I do, but could be happier."), (3, b"I'm mixed. I am happy with some things but unhappy with others, so it's hard to answer this question."), (4, b"I'm unhappy. I'm not fired up about my job."), (5, b"I'm really unhappy. I don't look forward to coming to work.")]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='employee',
            name='talent_cat',
            field=models.IntegerField(choices=[(1, b"I'm not sure people know about my contributions."), (2, b"I'm bored or burnt out and need a change to get my groove back."), (3, b"I'm doing great at my job, but have limited upside in my current role."), (4, b'I could use some direct feedback to stay engaged.'), (5, b'I have more potential and need a new project to hit it.'), (6, b"I feel like the sky's the limit and can tackle any project.")]),
            preserve_default=False,
        ),
    ]
