# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def migrate_coaches(apps, schema_editor):
    if schema_editor.connection.schema_name == 'public':
        return

    Employee = apps.get_model('org', 'Employee')
    CoachCapacity = apps.get_model('org', 'CoachCapacity')

    coaches = Employee.objects.exclude(coachees=None).all()
    for coach in coaches:
        new_coach = CoachCapacity(employee=coach)
        new_coach.save()


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0013_auto_20150904_1329'),
    ]

    operations = [
        migrations.CreateModel(
            name='CoachCapacity',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('max_allowed_coachees', models.IntegerField(default=0)),
                ('num_coachees', models.IntegerField(default=0)),
                ('employee', models.OneToOneField(related_name='+', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RunPython(migrate_coaches, noop)
    ]
