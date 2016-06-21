# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0019_auto_20160105_0933'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbacksubmission',
            name='help_with',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='feedbacksubmission',
            name='help_with_helpful',
            field=models.OneToOneField(related_name='help_with_submission', null=True, blank=True, to='feedback.FeedbackHelpful'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='feedbacksubmission',
            name='help_with_summarized',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
    ]
