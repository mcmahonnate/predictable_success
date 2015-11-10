# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0004_customer_show_beta_features'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='feedback_could_improve_on_question',
            field=models.TextField(default=b'What, if anything, is holding them back?'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='customer',
            name='feedback_excels_at_question',
            field=models.TextField(default=b'What does this individual do when they are at their best?'),
            preserve_default=True,
        ),
    ]
