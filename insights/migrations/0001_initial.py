# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email', models.EmailField(max_length=75)),
                ('first_name', models.CharField(max_length=32)),
                ('last_name', models.CharField(max_length=32)),
                ('access_token', models.CharField(max_length=32, unique=True, null=True)),
                ('talent_category', models.CharField(max_length=2, choices=[(1, b"I'm not sure people know about my contributions."), (2, b"I'm bored or burnt out and need a change to get my groove back."), (3, b"I'm doing great at my job, but have limited upside in my current role."), (4, b'I could use some direct feedback to stay engaged.'), (5, b'I have more potential and need a new project to hit it.'), (6, b"I feel like the sky's the limit and can tackle any project.")])),
                ('engagement', models.CharField(max_length=2, choices=[(1, b'Never been happier! I love coming to work every day.'), (2, b"I'm happy! I like my job, enjoy what I do, but could be happier."), (3, b"I'm mixed. I am happy with some things but unhappy with others, so it's hard to answer this question."), (4, b"I'm unhappy. I'm not fired up about my job."), (5, b"I'm really unhappy. I don't look forward to coming to work.")])),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
