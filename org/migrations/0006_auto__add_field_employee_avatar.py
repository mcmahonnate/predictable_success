# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Employee.avatar'
        db.add_column(u'org_employee', 'avatar',
                      self.gf('django.db.models.fields.files.ImageField')(default='', max_length=100, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Employee.avatar'
        db.delete_column(u'org_employee', 'avatar')


    models = {
        u'org.employee': {
            'Meta': {'object_name': 'Employee'},
            'avatar': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'base_camp': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'display': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'full_name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'hire_date': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'job_title': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'team': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'to': u"orm['org.Team']", 'null': 'True', 'blank': 'True'}),
            'u_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        u'org.leadership': {
            'Meta': {'object_name': 'Leadership'},
            'employee': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'+'", 'to': u"orm['org.Employee']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'leader': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'+'", 'to': u"orm['org.Employee']"})
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