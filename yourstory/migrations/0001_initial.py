# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0013_auto_20150904_1329'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeeChoiceResponse',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('question', models.TextField()),
                ('is_public', models.BooleanField(default=False)),
                ('employees', models.ManyToManyField(to='org.Employee')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TextResponse',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('question', models.TextField()),
                ('text', models.TextField(blank=True)),
                ('is_public', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='YourStory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('a1', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a10', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a11', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a12', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a13', models.ForeignKey(related_name='+', to='yourstory.EmployeeChoiceResponse', null=True)),
                ('a14', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a15', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a16', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a17', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a18', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a19', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a2', models.ForeignKey(related_name='+', to='yourstory.EmployeeChoiceResponse', null=True)),
                ('a20', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a21', models.ForeignKey(related_name='+', to='yourstory.EmployeeChoiceResponse', null=True)),
                ('a3', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a4', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a5', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a6', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a7', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a8', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('a9', models.ForeignKey(related_name='+', to='yourstory.EmployeeChoiceResponse', null=True)),
                ('employee', models.ForeignKey(to='org.Employee', unique=True)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
    ]
