# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0014_employee_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='talent_category',
            field=models.IntegerField(null=True, choices=[(6, b"I'm not sure what my future looks like, or if people know about my current contributions."), (5, b'I feel like my expertise and responsibilities are misaligned.'), (4, b"I'm crushing it and want to continue focusing on developing skills for this role."), (3, b"I'm doing a good job, but would like more direction."), (2, b"I'm crushing it and want to focus on developing skills outside of my current role."), (1, b"I'm crushing it, and I have the freedom to pick work that excites me.")]),
            preserve_default=True,
        ),
    ]
