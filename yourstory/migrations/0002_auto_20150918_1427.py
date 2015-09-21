# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('yourstory', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='yourstory',
            name='a1',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a10',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a11',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a12',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a13',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.EmployeeChoiceResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a14',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a15',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a16',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a17',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a18',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a19',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a2',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.EmployeeChoiceResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a20',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a21',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.EmployeeChoiceResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a3',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a4',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a5',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a6',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a7',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a8',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.TextResponse', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='yourstory',
            name='a9',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to='yourstory.EmployeeChoiceResponse', null=True),
            preserve_default=True,
        ),
    ]
