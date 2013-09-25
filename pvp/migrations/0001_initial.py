# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'PvpEvaluation'
        db.create_table(u'pvp_pvpevaluation', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('employee', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['org.Employee'])),
            ('date', self.gf('django.db.models.fields.DateField')()),
            ('potential', self.gf('django.db.models.fields.IntegerField')()),
            ('performance', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'pvp', ['PvpEvaluation'])

        # Adding unique constraint on 'PvpEvaluation', fields ['employee', 'date']
        db.create_unique(u'pvp_pvpevaluation', ['employee_id', 'date'])


    def backwards(self, orm):
        # Removing unique constraint on 'PvpEvaluation', fields ['employee', 'date']
        db.delete_unique(u'pvp_pvpevaluation', ['employee_id', 'date'])

        # Deleting model 'PvpEvaluation'
        db.delete_table(u'pvp_pvpevaluation')


    models = {
        u'org.employee': {
            'Meta': {'object_name': 'Employee'},
            'base_camp': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'display': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'hire_date': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'informal_name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'job_title': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'organization': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['org.Organization']"}),
            'team': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'to': u"orm['org.Team']", 'null': 'True', 'blank': 'True'}),
            'u_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        u'org.organization': {
            'Meta': {'object_name': 'Organization'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'subdomain': ('django.db.models.fields.CharField', [], {'max_length': '15'})
        },
        u'org.team': {
            'Meta': {'object_name': 'Team'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'leader': ('django.db.models.fields.related.OneToOneField', [], {'related_name': "'+'", 'unique': 'True', 'to': u"orm['org.Employee']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        u'pvp.pvpevaluation': {
            'Meta': {'unique_together': "(('employee', 'date'),)", 'object_name': 'PvpEvaluation'},
            'date': ('django.db.models.fields.DateField', [], {}),
            'employee': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['org.Employee']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'performance': ('django.db.models.fields.IntegerField', [], {}),
            'potential': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['pvp']