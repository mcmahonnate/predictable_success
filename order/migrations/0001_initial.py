# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Charge',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('amount', models.IntegerField()),
                ('stripe_id', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', models.CharField(max_length=255)),
                ('discount_percent', models.IntegerField()),
                ('description', models.CharField(max_length=255)),
                ('expires_at', models.DateTimeField(null=True, blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='charge',
            name='coupon',
            field=models.ForeignKey(related_name='charges', blank=True, to='order.Coupon', null=True),
        ),
    ]
