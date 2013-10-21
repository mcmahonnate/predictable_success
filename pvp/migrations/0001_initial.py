# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'EvaluationRound'
        db.create_table(u'pvp_evaluationround', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('date', self.gf('django.db.models.fields.DateField')()),
        ))
        db.send_create_signal(u'pvp', ['EvaluationRound'])

        # Adding model 'PvpEvaluation'
        db.create_table(u'pvp_pvpevaluation', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('employee', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['org.Employee'])),
            ('evaluation_round', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['pvp.EvaluationRound'])),
            ('potential', self.gf('django.db.models.fields.IntegerField')()),
            ('performance', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'pvp', ['PvpEvaluation'])

        # Adding unique constraint on 'PvpEvaluation', fields ['employee', 'evaluation_round']
        db.create_unique(u'pvp_pvpevaluation', ['employee_id', 'evaluation_round_id'])


    def backwards(self, orm):
        # Removing unique constraint on 'PvpEvaluation', fields ['employee', 'evaluation_round']
        db.delete_unique(u'pvp_pvpevaluation', ['employee_id', 'evaluation_round_id'])

        # Deleting model 'EvaluationRound'
        db.delete_table(u'pvp_evaluationround')

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
            'team': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'to': u"orm['org.Team']", 'null': 'True', 'blank': 'True'}),
            'u_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        u'org.team': {
            'Meta': {'object_name': 'Team'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'leader': ('django.db.models.fields.related.OneToOneField', [], {'related_name': "'+'", 'unique': 'True', 'to': u"orm['org.Employee']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        u'pvp.evaluationround': {
            'Meta': {'object_name': 'EvaluationRound'},
            'date': ('django.db.models.fields.DateField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'pvp.pvpevaluation': {
            'Meta': {'ordering': "['-evaluation_round__date']", 'unique_together': "(('employee', 'evaluation_round'),)", 'object_name': 'PvpEvaluation'},
            'employee': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['org.Employee']"}),
            'evaluation_round': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['pvp.EvaluationRound']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'performance': ('django.db.models.fields.IntegerField', [], {}),
            'potential': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['pvp']