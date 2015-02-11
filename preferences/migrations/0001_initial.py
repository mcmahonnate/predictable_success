# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Site'
        db.create_table(u'preferences_site', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('show_kolbe', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('show_vops', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('show_mbti', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'preferences', ['Site'])


    def backwards(self, orm):
        # Deleting model 'Site'
        db.delete_table(u'preferences_site')


    models = {
        u'preferences.site': {
            'Meta': {'object_name': 'Site'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'show_kolbe': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'show_mbti': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'show_vops': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        }
    }

    complete_apps = ['preferences']