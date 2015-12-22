# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0015_populate_was_helpful_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='FeedbackHelpful',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('helpfulness', models.IntegerField(default=0, choices=[(0, b'Not assessed'), (1, b'Some what helpful'), (2, b'Helpful'), (3, b'Very helpful')])),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('reason', models.TextField(blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='feedbacksubmission',
            name='could_improve_on_helpful',
            field=models.ForeignKey(related_name='could_improve_on_submission', blank=True, to='feedback.FeedbackHelpful', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='feedbacksubmission',
            name='excels_at_helpful',
            field=models.ForeignKey(related_name='excels_at_submission', blank=True, to='feedback.FeedbackHelpful', null=True),
            preserve_default=True,
        ),
    ]
