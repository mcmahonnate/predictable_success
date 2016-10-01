# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leadership_styles', '0014_auto_20160929_0925'),
    ]

    operations = [
        migrations.CreateModel(
            name='LeadershipStyleDescription',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('dominant_style_first', models.IntegerField(blank=True, null=True, choices=[(0, b'Visionary'), (1, b'Operator'), (2, b'Processor'), (3, b'Synergist')])),
                ('dominant_style_second', models.IntegerField(blank=True, null=True, choices=[(0, b'Visionary'), (1, b'Operator'), (2, b'Processor'), (3, b'Synergist')])),
                ('primary_style_first', models.IntegerField(blank=True, null=True, choices=[(0, b'Visionary'), (1, b'Operator'), (2, b'Processor'), (3, b'Synergist')])),
                ('primary_style_second', models.IntegerField(blank=True, null=True, choices=[(0, b'Visionary'), (1, b'Operator'), (2, b'Processor'), (3, b'Synergist')])),
                ('secondary_style_first', models.IntegerField(blank=True, null=True, choices=[(0, b'Visionary'), (1, b'Operator'), (2, b'Processor'), (3, b'Synergist')])),
                ('secondary_style_second', models.IntegerField(blank=True, null=True, choices=[(0, b'Visionary'), (1, b'Operator'), (2, b'Processor'), (3, b'Synergist')])),
                ('well_rounded_preferred_style', models.IntegerField(blank=True, null=True, choices=[(0, b'Visionary'), (1, b'Operator'), (2, b'Processor'), (3, b'Synergist')])),
                ('well_rounded', models.BooleanField(default=False)),
                ('description', models.TextField()),
            ],
        ),
    ]
