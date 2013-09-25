# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'PvpEvaluation'
        db.create_table(u'pvptracking_pvpevaluation', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('employee', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['orgstructure.Employee'])),
            ('date', self.gf('django.db.models.fields.DateField')()),
            ('potential', self.gf('django.db.models.fields.IntegerField')()),
            ('performance', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'pvptracking', ['PvpEvaluation'])


    def backwards(self, orm):
        # Deleting model 'PvpEvaluation'
        db.delete_table(u'pvptracking_pvpevaluation')


    models = {
        u'orgstructure.employee': {
            'Meta': {'object_name': 'Employee'},
            'base_camp': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'display': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'hire_date': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'informal_name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'job_title': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'organization': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['orgstructure.Organization']"}),
            'team': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['orgstructure.Team']", 'null': 'True'}),
            'u_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        u'orgstructure.organization': {
            'Meta': {'object_name': 'Organization'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'subdomain': ('django.db.models.fields.CharField', [], {'max_length': '15'})
        },
        u'orgstructure.team': {
            'Meta': {'object_name': 'Team'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'leader': ('django.db.models.fields.related.OneToOneField', [], {'related_name': "'+'", 'unique': 'True', 'to': u"orm['orgstructure.Employee']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        u'pvptracking.pvpevaluation': {
            'Meta': {'object_name': 'PvpEvaluation'},
            'date': ('django.db.models.fields.DateField', [], {}),
            'employee': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['orgstructure.Employee']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'performance': ('django.db.models.fields.IntegerField', [], {}),
            'potential': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['pvptracking']