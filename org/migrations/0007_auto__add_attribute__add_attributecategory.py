# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Attribute'
        db.create_table(u'org_attribute', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('employee', self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', to=orm['org.Employee'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('category', self.gf('django.db.models.fields.related.ForeignKey')(default=None, to=orm['org.AttributeCategory'], null=True, blank=True)),
        ))
        db.send_create_signal(u'org', ['Attribute'])

        # Adding model 'AttributeCategory'
        db.create_table(u'org_attributecategory', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
        ))
        db.send_create_signal(u'org', ['AttributeCategory'])


    def backwards(self, orm):
        # Deleting model 'Attribute'
        db.delete_table(u'org_attribute')

        # Deleting model 'AttributeCategory'
        db.delete_table(u'org_attributecategory')


    models = {
        u'org.attribute': {
            'Meta': {'object_name': 'Attribute'},
            'category': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'to': u"orm['org.AttributeCategory']", 'null': 'True', 'blank': 'True'}),
            'employee': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'+'", 'to': u"orm['org.Employee']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        u'org.attributecategory': {
            'Meta': {'object_name': 'AttributeCategory'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
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