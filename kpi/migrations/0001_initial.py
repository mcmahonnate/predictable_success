# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Indicator'
        db.create_table(u'kpi_indicator', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
        ))
        db.send_create_signal(u'kpi', ['Indicator'])

        # Adding model 'Performance'
        db.create_table(u'kpi_performance', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('value', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=12, decimal_places=2)),
            ('date', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'kpi', ['Performance'])


    def backwards(self, orm):
        # Deleting model 'Indicator'
        db.delete_table(u'kpi_indicator')

        # Deleting model 'Performance'
        db.delete_table(u'kpi_performance')


    models = {
        u'kpi.indicator': {
            'Meta': {'object_name': 'Indicator'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        u'kpi.performance': {
            'Meta': {'object_name': 'Performance'},
            'date': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'value': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '12', 'decimal_places': '2'})
        }
    }

    complete_apps = ['kpi']