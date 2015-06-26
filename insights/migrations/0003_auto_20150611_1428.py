# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0002_employee_company'),
    ]

    operations = [
        migrations.CreateModel(
            name='Prospect',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('first_name', models.CharField(max_length=32)),
                ('last_name', models.CharField(max_length=32)),
                ('company', models.CharField(max_length=64, null=True)),
                ('email', models.EmailField(unique=True, max_length=75)),
                ('access_token', models.CharField(max_length=32, null=True)),
                ('talent_category', models.IntegerField(null=True, choices=[(6, b"I'm not sure what my future looks like, or if people know about my current contributions."), (5, b'I feel like my expertise and responsibilities are misaligned.'), (4, b"I'm crushing it and want to continue focusing on developing skills for this role."), (3, b"I'm doing a good job, but would like more direction."), (2, b"I'm crushing it and want to focus on developing skills outside of my current role."), (1, b"I'm crushing it, and I have the freedom to pick work that excites me.")])),
                ('engagement', models.IntegerField(null=True, choices=[(1, b'Never been happier! I love coming to work every day.'), (2, b"I'm happy! I like my job, enjoy what I do, but could be happier."), (3, b"I'm mixed. I am happy with some things but unhappy with others, so it's hard to answer this question."), (4, b"I'm unhappy. I'm not fired up about my job."), (5, b"I'm really unhappy. I don't look forward to coming to work.")])),
                ('team_lead', models.BooleanField(default=False)),
                ('uid', models.CharField(max_length=8, null=True)),
                ('visited_survey', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.DeleteModel(
            name='Employee',
        ),
    ]
