# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import leadership_styles.models


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0001_initial'),
        ('leadership_styles', '0003_auto_20160811_1013'),
    ]

    operations = [
        migrations.CreateModel(
            name='LeadershipStyleRequest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('expiration_date', models.DateField(default=leadership_styles.models.default_leadership_style_request_expiration_date, null=True, blank=True)),
                ('message', models.TextField(blank=True)),
                ('request_date', models.DateTimeField(auto_now_add=True)),
                ('was_declined', models.BooleanField(default=False)),
                ('was_responded_to', models.BooleanField(default=False)),
                ('requester', models.ForeignKey(related_name='leadership_style_requests', to='org.Employee')),
                ('reviewer', models.ForeignKey(related_name='requests_for_leadership_style', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='employeeleadershipstyle',
            name='request',
            field=models.ForeignKey(related_name='submission', blank=True, to='leadership_styles.LeadershipStyleRequest', null=True),
            preserve_default=True,
        ),
    ]
