# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting model 'Site'
        db.delete_table(u'preferences_site')

        # Adding model 'SitePreferences'
        db.create_table(u'preferences_sitepreferences', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('site', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['sites.Site'], unique=True, null=True, on_delete=models.SET_NULL, blank=True)),
            ('show_kolbe', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('show_vops', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('show_mbti', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('show_coaches', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'preferences', ['SitePreferences'])


    def backwards(self, orm):
        # Adding model 'Site'
        db.create_table(u'preferences_site', (
            ('show_vops', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('show_mbti', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('site', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['sites.Site'], unique=True, null=True, on_delete=models.SET_NULL, blank=True)),
            ('show_kolbe', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('show_coaches', self.gf('django.db.models.fields.BooleanField')(default=False)),
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal(u'preferences', ['Site'])

        # Deleting model 'SitePreferences'
        db.delete_table(u'preferences_sitepreferences')


    models = {
        u'preferences.sitepreferences': {
            'Meta': {'object_name': 'SitePreferences'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'show_coaches': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'show_kolbe': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'show_mbti': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'show_vops': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'site': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['sites.Site']", 'unique': 'True', 'null': 'True', 'on_delete': 'models.SET_NULL', 'blank': 'True'})
        },
        u'sites.site': {
            'Meta': {'ordering': "('domain',)", 'object_name': 'Site', 'db_table': "'django_site'"},
            'domain': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['preferences']