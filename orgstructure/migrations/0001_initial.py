# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Organization'
        db.create_table(u'orgstructure_organization', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('subdomain', self.gf('django.db.models.fields.CharField')(max_length=15)),
        ))
        db.send_create_signal(u'orgstructure', ['Organization'])

        # Adding model 'Employee'
        db.create_table(u'orgstructure_employee', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('informal_name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('job_title', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('base_camp', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('u_name', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('hire_date', self.gf('django.db.models.fields.DateField')(null=True)),
            ('display', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('organization', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['orgstructure.Organization'])),
            ('team', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['orgstructure.Team'], null=True)),
        ))
        db.send_create_signal(u'orgstructure', ['Employee'])

        # Adding model 'Team'
        db.create_table(u'orgstructure_team', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('leader', self.gf('django.db.models.fields.related.OneToOneField')(related_name='+', unique=True, to=orm['orgstructure.Employee'])),
        ))
        db.send_create_signal(u'orgstructure', ['Team'])

        # Adding model 'Mentorship'
        db.create_table(u'orgstructure_mentorship', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('mentor', self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', to=orm['orgstructure.Employee'])),
            ('mentee', self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', to=orm['orgstructure.Employee'])),
        ))
        db.send_create_signal(u'orgstructure', ['Mentorship'])


    def backwards(self, orm):
        # Deleting model 'Organization'
        db.delete_table(u'orgstructure_organization')

        # Deleting model 'Employee'
        db.delete_table(u'orgstructure_employee')

        # Deleting model 'Team'
        db.delete_table(u'orgstructure_team')

        # Deleting model 'Mentorship'
        db.delete_table(u'orgstructure_mentorship')


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
        u'orgstructure.mentorship': {
            'Meta': {'object_name': 'Mentorship'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mentee': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'+'", 'to': u"orm['orgstructure.Employee']"}),
            'mentor': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'+'", 'to': u"orm['orgstructure.Employee']"})
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

    complete_apps = ['orgstructure']