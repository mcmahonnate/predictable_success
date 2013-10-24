# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import DataMigration
from django.db import models

class Migration(DataMigration):

    def forwards(self, orm):
        "Write your forwards methods here."
        # Note: Don't use "from appname.models import ModelName". 
        # Use orm.ModelName to refer to models in this application,
        # and orm['appname.ModelName'] for models in other applications.
        for e in orm.Employee.objects.all():
            e.full_name = e.informal_name
            e.save

    def backwards(self, orm):
        "Write your backwards methods here."
        for e in orm.employee.objects.all():
            e.informal_name = ""
            e.save

    models = {
        u'org.employee': {
            'Meta': {'object_name': 'Employee'},
            'base_camp': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'display': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'full_name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'hire_date': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'informal_name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'job_title': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'team': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'to': u"orm['org.Team']", 'null': 'True', 'blank': 'True'}),
            'u_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        u'org.mentorship': {
            'Meta': {'object_name': 'Mentorship'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mentee': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'+'", 'to': u"orm['org.Employee']"}),
            'mentor': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'+'", 'to': u"orm['org.Employee']"})
        },
        u'org.team': {
            'Meta': {'object_name': 'Team'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'leader': ('django.db.models.fields.related.OneToOneField', [], {'related_name': "'+'", 'unique': 'True', 'to': u"orm['org.Employee']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        }
    }

    complete_apps = ['org']
    symmetrical = True
