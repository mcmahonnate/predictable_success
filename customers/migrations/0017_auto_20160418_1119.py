# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0016_customer_show_qualities'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='devzone_selfie_email_body',
            field=models.TextField(default=b"<p>Hello {{ recipient_first_name }}!</p> <p>You're invited to participate in the ID process. We're hoping you will read on to learn more about this process and take a Selfie.    If you don't wish to take the selfie, no problem! It's optional.</p> <p>What is this in a nutshell?</p><p>No traditional performance reviews here! Twice each year we ask department leaders to sit down and have a conversation about the development of the Fools on their team. To make that the best conversation possible, we want to hear from you (that's where the Selfie comes in). The goal is to make sure you, your boss, and your boss's boss are all aligned around how best to support you.</p> <p>Sound good? <a href='{{ response_url }}'>Take your Selfie</a></p>"),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='customer',
            name='devzone_selfie_email_subject',
            field=models.TextField(default=b'Scoutmap ID Modeling in 4 Steps'),
            preserve_default=True,
        ),
    ]
