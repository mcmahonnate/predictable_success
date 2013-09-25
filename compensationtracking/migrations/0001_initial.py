# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'CompensationSummary'
        db.create_table(u'compensationtracking_compensationsummary', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('employee', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['orgstructure.Employee'])),
            ('year', self.gf('django.db.models.fields.IntegerField')(default=2013)),
            ('fiscal_year', self.gf('django.db.models.fields.IntegerField')(default=2013)),
            ('salary', self.gf('django.db.models.fields.DecimalField')(max_digits=12, decimal_places=2)),
            ('bonus', self.gf('django.db.models.fields.DecimalField')(max_digits=12, decimal_places=2)),
            ('discretionary', self.gf('django.db.models.fields.DecimalField')(max_digits=12, decimal_places=2)),
            ('writer_payments_and_royalties', self.gf('django.db.models.fields.DecimalField')(max_digits=12, decimal_places=2)),
        ))
        db.send_create_signal(u'compensationtracking', ['CompensationSummary'])


    def backwards(self, orm):
        # Deleting model 'CompensationSummary'
        db.delete_table(u'compensationtracking_compensationsummary')


    models = {
        u'compensationtracking.compensationsummary': {
            'Meta': {'object_name': 'CompensationSummary'},
            'bonus': ('django.db.models.fields.DecimalField', [], {'max_digits': '12', 'decimal_places': '2'}),
            'discretionary': ('django.db.models.fields.DecimalField', [], {'max_digits': '12', 'decimal_places': '2'}),
            'employee': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['orgstructure.Employee']"}),
            'fiscal_year': ('django.db.models.fields.IntegerField', [], {'default': '2013'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'salary': ('django.db.models.fields.DecimalField', [], {'max_digits': '12', 'decimal_places': '2'}),
            'writer_payments_and_royalties': ('django.db.models.fields.DecimalField', [], {'max_digits': '12', 'decimal_places': '2'}),
            'year': ('django.db.models.fields.IntegerField', [], {'default': '2013'})
        },
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
        }
    }

    complete_apps = ['compensationtracking']