# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0015_merge'),
        ('feedback', '0005_auto_20151006_1310'),
    ]

    operations = [
        migrations.CreateModel(
            name='FeedbackDigest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('summary', models.TextField(blank=True)),
                ('has_been_delivered', models.BooleanField(default=False)),
                ('coach', models.ForeignKey(related_name='+', to='org.Employee')),
                ('subject', models.ForeignKey(related_name='+', to='org.Employee')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='feedbacksubmission',
            name='feedback_digest',
            field=models.ForeignKey(related_name='submissions', blank=True, to='feedback.FeedbackDigest', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='feedbacksubmission',
            name='feedback_request',
            field=models.OneToOneField(related_name='submission', null=True, blank=True, to='feedback.FeedbackRequest'),
            preserve_default=True,
        ),
    ]
