# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.db.models import Q
from datetime import datetime

def populate_was_helpful_date(apps, schema_editor):
    if schema_editor.connection.schema_name == 'public':
        return
    FeedbackSubmission = apps.get_model("feedback", "FeedbackSubmission")
    excels_helpful_submissions = FeedbackSubmission.objects.filter(Q(excels_at_was_helpful=True) & Q(excels_at_was_helpful_date__isnull=True))
    excels_helpful_submissions.update(excels_at_was_helpful_date=datetime.now())
    could_improve_on_helpful_submissions = FeedbackSubmission.objects.filter(Q(could_improve_on_was_helpful=True) & Q(could_improve_on_was_helpful_date__isnull=True))
    could_improve_on_helpful_submissions.update(could_improve_on_was_helpful_date=datetime.now())

def backwards(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0014_auto_20151222_1017'),
    ]

    operations = [
        migrations.RunPython(populate_was_helpful_date, backwards),
    ]