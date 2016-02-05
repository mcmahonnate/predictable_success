# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0014_auto_20160129_0920'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='devzones_id_session_intro',
            field=models.TextField(default=b"will be representing you at your ID meeting. What's that you say? It's a meeting where senior leaders in your department discuss the development needs of everyone on your team. Hold up...don't I get a say about what my development needs are? You do now! In fact you'll be leading it. We've built and tested a brief Selfie survey designed to help you find the best development area suited to your needs. When you're done your leadership team will see your results, which will help you and them shape the kind of development and support you want and need."),
            preserve_default=True,
        ),
    ]
