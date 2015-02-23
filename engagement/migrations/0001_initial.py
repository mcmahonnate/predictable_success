# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Happiness',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('assessed_date', models.DateField(auto_now_add=True)),
                ('assessment', models.IntegerField(choices=[(1, b'Very unhappy'), (2, b'Unhappy'), (3, b'Indifferent'), (4, b'Happy'), (5, b'Very happy')])),
                ('assessed_by', models.ForeignKey(related_name='+', to='org.Employee')),
                ('employee', models.ForeignKey(related_name='happys', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
