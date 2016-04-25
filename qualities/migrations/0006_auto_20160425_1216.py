# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('qualities', '0005_auto_20160424_0921'),
    ]

    operations = [
        migrations.AlterField(
            model_name='qualitycluster',
            name='qualities',
            field=models.ManyToManyField(related_name='clusters', to='qualities.Quality'),
            preserve_default=True,
        ),
    ]
