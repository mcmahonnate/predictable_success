# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0017_auto_20151223_1319'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feedbacksubmission',
            name='could_improve_on_helpful',
            field=models.OneToOneField(related_name='could_improve_on_submission', null=True, blank=True, to='feedback.FeedbackHelpful'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='feedbacksubmission',
            name='excels_at_helpful',
            field=models.OneToOneField(related_name='excels_at_submission', null=True, blank=True, to='feedback.FeedbackHelpful'),
            preserve_default=True,
        ),
    ]
