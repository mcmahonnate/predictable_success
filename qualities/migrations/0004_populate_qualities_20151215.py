# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def populate_qualities(apps, schema_editor):
    if schema_editor.connection.schema_name == 'public':
        return
    QualityCluster = apps.get_model("qualities", "QualityCluster")
    cluster01 = QualityCluster(name='Foolish Traits')
    cluster01.save()
    Quality = apps.get_model("qualities", "Quality")
    quality01 = Quality(name='Crave Improvement', description='Constantly seeking ways to improve their skills, broaden their roles, and drive the business.')
    quality01.save()
    cluster01.qualities.add(quality01)
    quality02 = Quality(name='Act Like Owners', description='Making commercially minded decisions with the long-term health of the Fool in mind.')
    quality02.save()
    cluster01.qualities.add(quality02)
    quality03 = Quality(name='Multiply the Force', description='Supporting, guiding, and collaborating to ensure that others succeed.')
    quality03.save()
    cluster01.qualities.add(quality03)
    quality04 = Quality(name='Solve Problems with Optimism ', description='Identifying opportunities for improvement and working collaboratively to get there.')
    quality04.save()
    cluster01.qualities.add(quality04)
    quality05 = Quality(name='Succeed with Character', description='Doing the right thing, even if it’s the harder path, and living our purpose and core values.')
    quality05.save()
    cluster01.qualities.add(quality05)
    quality06 = Quality(name='Communicate Appropriately', description='Finding the balance of autonomy and communication, keeping others in the loop and breaking down silos.')
    quality06.save()
    cluster01.qualities.add(quality06)
    quality07 = Quality(name='Prioritize Diplomatically', description='Working on the right things, knowing when and how to say no.')
    quality07.save()
    cluster01.qualities.add(quality07)
    quality08 = Quality(name='Produce Outcomes', description='Holding themselves and others accountable with metrics-based results.')
    quality08.save()
    cluster01.qualities.add(quality08)
    quality09 = Quality(name='Adapt', description='Thriving in changing contexts.')
    quality09.save()
    cluster01.qualities.add(quality09)
    cluster01.save()


def backwards(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('qualities', '0003_auto_20151127_2149'),
    ]

    operations = [
        migrations.RunPython(populate_qualities, backwards),
    ]
