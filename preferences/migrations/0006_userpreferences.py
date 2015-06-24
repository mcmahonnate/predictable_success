# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('preferences', '0005_auto_20150327_1018'),
    ]

    operations = [
        migrations.DeleteModel('SitePreferences'),
        migrations.CreateModel(
            name='UserPreferences',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dashboard_view', models.IntegerField(default=1, choices=[(2, b'Stats-focused View'), (1, b'Discussion-focused View')])),
                ('user', models.OneToOneField(related_name='preferences', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
