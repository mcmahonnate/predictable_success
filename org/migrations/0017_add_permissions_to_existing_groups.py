# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def add_permissions_to_existing_groups(apps, schema_editor):
    if schema_editor.connection.schema_name == 'public':
        return
    Group = apps.get_model("auth", "Group")
    ContentType = apps.get_model("contenttypes", "ContentType")
    Permission = apps.get_model("auth", "Permission")
    try:
        content_type = ContentType.objects.get(app_label='org', model='employee')
        view_employees_I_lead = Permission.objects.get(content_type=content_type, codename='view_employees_I_lead')
        all_access = Group.objects.get(name='AllAccess')
        team_leads = Group.objects.get(name='TeamLeadAccess')
        all_access.permissions.add(view_employees_I_lead)
        all_access.save()
        team_leads.permissions.add(view_employees_I_lead)
        team_leads.save()
    except:
        print 'migration skipped'

def backwards(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0016_auto_20151110_1009'),
    ]

    operations = [
        migrations.RunPython(add_permissions_to_existing_groups, backwards),
    ]
