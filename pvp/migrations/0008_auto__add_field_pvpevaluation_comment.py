# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'PvpEvaluation.comment'
        db.add_column(u'pvp_pvpevaluation', 'comment',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['blah.Comment']),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'PvpEvaluation.comment'
        db.delete_column(u'pvp_pvpevaluation', 'comment_id')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'blah.comment': {
            'Meta': {'object_name': 'Comment'},
            'content': ('django.db.models.fields.TextField', [], {}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'content_type'", 'to': u"orm['contenttypes.ContentType']"}),
            'created_date': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified_date': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'object_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'owner_content_type': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'owner_content_type'", 'null': 'True', 'to': u"orm['contenttypes.ContentType']"}),
            'owner_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True', 'null': 'True', 'blank': 'True'}),
            'visibility': ('django.db.models.fields.IntegerField', [], {'default': '2'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'org.employee': {
            'Meta': {'object_name': 'Employee'},
            'avatar': ('django.db.models.fields.files.ImageField', [], {'default': "'/media/avatars/geneRick.jpg'", 'max_length': '100', 'blank': 'True'}),
            'avatar_small': ('django.db.models.fields.files.ImageField', [], {'default': "'/media/avatars/small/geneRick.jpeg'", 'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'coach': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'coachee'", 'null': 'True', 'to': u"orm['org.Employee']"}),
            'departure_date': ('django.db.models.fields.DateField', [], {'default': 'None', 'null': 'True', 'blank': 'True'}),
            'display': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'email': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'full_name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'hire_date': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'job_title': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'team': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'to': u"orm['org.Team']", 'null': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['auth.User']", 'unique': 'True', 'null': 'True', 'on_delete': 'models.SET_NULL', 'blank': 'True'})
        },
        u'org.team': {
            'Meta': {'object_name': 'Team'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'leader': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'related_name': "'+'", 'null': 'True', 'blank': 'True', 'to': u"orm['org.Employee']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        u'pvp.evaluationround': {
            'Meta': {'object_name': 'EvaluationRound'},
            'date': ('django.db.models.fields.DateField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_complete': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        },
        u'pvp.pvpdescription': {
            'Meta': {'object_name': 'PvpDescription'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'performance': ('django.db.models.fields.IntegerField', [], {}),
            'potential': ('django.db.models.fields.IntegerField', [], {})
        },
        u'pvp.pvpevaluation': {
            'Meta': {'ordering': "['-evaluation_round__date']", 'unique_together': "(('employee', 'evaluation_round'),)", 'object_name': 'PvpEvaluation'},
            'comment': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': u"orm['blah.Comment']"}),
            'employee': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'pvp'", 'to': u"orm['org.Employee']"}),
            'evaluation_round': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['pvp.EvaluationRound']"}),
            'evaluator': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_complete': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'performance': ('django.db.models.fields.IntegerField', [], {'default': '0', 'blank': 'True'}),
            'potential': ('django.db.models.fields.IntegerField', [], {'default': '0', 'blank': 'True'})
        }
    }

    complete_apps = ['pvp']