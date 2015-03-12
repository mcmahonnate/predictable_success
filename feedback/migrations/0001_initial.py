# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FeedbackRequest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('request_date', models.DateTimeField(auto_now_add=True)),
                ('expiration_date', models.DateField(null=True, blank=True)),
                ('message', models.TextField(blank=True)),
                ('is_complete', models.BooleanField()),
                ('requester', models.ForeignKey(related_name='feedback_requests', to='org.Employee')),
                ('reviewer', models.ForeignKey(related_name='requests_for_feedback', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='FeedbackSubmission',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('feedback_date', models.DateTimeField(auto_now_add=True)),
                ('excels_at', models.TextField(blank=True)),
                ('could_improve_on', models.TextField(blank=True)),
                ('has_been_delivered', models.BooleanField()),
                ('feedback_request', models.ForeignKey(related_name='submissions', blank=True, to='feedback.FeedbackRequest', null=True)),
                ('reviewer', models.ForeignKey(related_name='feedback_submissions', to='org.Employee')),
                ('subject', models.ForeignKey(related_name='feedback_about', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
