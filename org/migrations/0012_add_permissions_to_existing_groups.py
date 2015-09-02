# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def add_permissions_to_existing_groups(apps, schema_editor):
    if schema_editor.connection.schema_name == 'public':
        return
    Group = apps.get_model("auth", "Group")
    ContentType = apps.get_model("contenttypes", "ContentType")
    Permission = apps.get_model("auth", "Permission")

    content_type = ContentType.objects.get(app_label='org', model='employee')
    view_comments_permission = Permission.objects.get(content_type=content_type, codename='view_employee_comments')
    view_employees_permission = Permission.objects.get(content_type=content_type, codename='view_employees')
    all_access = Group.objects.get(name='AllAccess')
    coaches = Group.objects.get(name='CoachAccess')
    team_leads = Group.objects.get(name='TeamLeadAccess')

    all_access.permissions.add(view_comments_permission, view_employees_permission)
    all_access.save()
    coaches.permissions.add(view_comments_permission)
    coaches.save()
    team_leads.permissions.add(view_comments_permission)
    team_leads.save()


def backwards(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0011_populate_is_coach_from_coaches_group'),
    ]

    operations = [
        migrations.RunPython(add_permissions_to_existing_groups, backwards),
    ]
