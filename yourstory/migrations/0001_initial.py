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
                ('is_public', models.BooleanField(default=False)),
                ('text', models.TextField(blank=True)),
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
                ('describe_a_great_day', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('discuss_what_youre_working_on', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('employee', models.ForeignKey(to='org.Employee', unique=True)),
                ('feedback_outside_your_circle', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('get_to_know_3_fools', models.ForeignKey(related_name='+', to='yourstory.EmployeeChoiceResponse', null=True)),
                ('greatest_accomplishments_at_tmf', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('greatest_financial_investment', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('how_do_you_feel_about_your_role', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('how_do_you_get_to_work', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('new_cash_flow_idea', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('office_space_changes', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('one_new_project_you_want_to_work_on', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('one_thing_youd_like_to_delegate', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('one_way_tmf_can_be_much_better', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('starbucks_order', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('talk_to_a_member', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('tell_leadership_anything', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('wants_to_get_better_at', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('where_would_you_like_to_work', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('who_advocates_for_your_work', models.ForeignKey(related_name='+', to='yourstory.EmployeeChoiceResponse', null=True)),
                ('who_has_developed_you', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('who_to_bring_to_hq', models.ForeignKey(related_name='+', to='yourstory.TextResponse', null=True)),
                ('who_will_you_develop', models.ForeignKey(related_name='+', to='yourstory.EmployeeChoiceResponse', null=True)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
    ]
