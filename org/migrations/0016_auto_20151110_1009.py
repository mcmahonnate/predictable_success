# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0015_merge'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='employee',
            options={'permissions': (('view_employees', 'Can view employees'), ('create_employee_comments', 'Can create comments on employees'), ('view_employee_comments', 'Can view comments on employees'), ('view_employees_I_lead', 'Can view employees I lead'))},
        ),
    ]
