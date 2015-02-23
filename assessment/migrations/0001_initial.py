# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AssessmentBand',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('min_value', models.IntegerField()),
                ('max_value', models.IntegerField()),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AssessmentCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AssessmentComparison',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('assessed_date', models.DateField(auto_now_add=True)),
                ('description', models.TextField()),
                ('that', models.ForeignKey(related_name='+', to='assessment.AssessmentBand')),
                ('this', models.ForeignKey(related_name='+', to='assessment.AssessmentBand')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AssessmentType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='EmployeeAssessment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('score', models.IntegerField()),
                ('category', models.ForeignKey(related_name='+', to='assessment.AssessmentCategory')),
                ('employee', models.ForeignKey(related_name='+', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='MBTI',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.CharField(max_length=4, choices=[(b'istj', b'ISTJ'), (b'estj', b'ESTJ'), (b'isfj', b'ISFJ'), (b'esfj', b'ESFJ'), (b'istp', b'ISTP'), (b'estp', b'ESTP'), (b'esfp', b'ESFP'), (b'isfp', b'ISFP'), (b'entj', b'ENTJ'), (b'intj', b'INTJ'), (b'entp', b'ENTP'), (b'intp', b'INTP'), (b'enfj', b'ENFJ'), (b'infj', b'INFJ'), (b'enfp', b'ENFP'), (b'infp', b'INFP')])),
                ('employee', models.ForeignKey(related_name='+', to='org.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='MBTIEmployeeDescription',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.CharField(max_length=4, choices=[(b'istj', b'ISTJ'), (b'estj', b'ESTJ'), (b'isfj', b'ISFJ'), (b'esfj', b'ESFJ'), (b'istp', b'ISTP'), (b'estp', b'ESTP'), (b'esfp', b'ESFP'), (b'isfp', b'ISFP'), (b'entj', b'ENTJ'), (b'intj', b'INTJ'), (b'entp', b'ENTP'), (b'intp', b'INTP'), (b'enfj', b'ENFJ'), (b'infj', b'INFJ'), (b'enfp', b'ENFP'), (b'infp', b'INFP')])),
                ('description', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='MBTITeamDescription',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.CharField(max_length=4, choices=[(b'istj', b'ISTJ'), (b'estj', b'ESTJ'), (b'isfj', b'ISFJ'), (b'esfj', b'ESFJ'), (b'istp', b'ISTP'), (b'estp', b'ESTP'), (b'esfp', b'ESFP'), (b'isfp', b'ISFP'), (b'entj', b'ENTJ'), (b'intj', b'INTJ'), (b'entp', b'ENTP'), (b'intp', b'INTP'), (b'enfj', b'ENFJ'), (b'infj', b'INFJ'), (b'enfp', b'ENFP'), (b'infp', b'INFP')])),
                ('description', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TeamAssessmentCluster',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('bands', models.ManyToManyField(to='assessment.AssessmentBand')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='assessmentcategory',
            name='assessment',
            field=models.ForeignKey(related_name='+', to='assessment.AssessmentType'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assessmentband',
            name='category',
            field=models.ForeignKey(related_name='+', to='assessment.AssessmentCategory'),
            preserve_default=True,
        ),
    ]
