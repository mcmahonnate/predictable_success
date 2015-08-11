from rest_framework import serializers
from org.api.serializers import MinimalEmployeeSerializer, UserSerializer
from django.contrib.contenttypes.models import ContentType
from blah.models import Comment
from checkins.models import CheckIn
from ..models import Event
from django.utils.log import getLogger

logger = getLogger('talentdashboard')


class EventSerializer(serializers.ModelSerializer):
    employee = MinimalEmployeeSerializer()
    user = UserSerializer()
    type = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    verb = serializers.SerializerMethodField()

    def get_type(self, obj):
        return obj.event_type.name

    def get_description(self, obj):
        comment_type = ContentType.objects.get_for_model(Comment)
        checkin_type = ContentType.objects.get_for_model(CheckIn)
        if obj.event_type.id is comment_type.id:
            comment = Comment.objects.get(pk=obj.event_id)
            return comment.content
        elif obj.event_type.id is checkin_type.id:
            checkin = CheckIn.objects.get(pk=obj.event_id)
            return checkin.get_summary(self.context['request'].user)
        return None

    def get_verb(self, obj):
        comment_type = ContentType.objects.get_for_model(Comment)
        checkin_type = ContentType.objects.get_for_model(CheckIn)
        if obj.event_type.id is comment_type.id:
            return 'commented'
        elif obj.event_type.id is checkin_type.id:
            return 'checked in'
        return None

    class Meta:
        model = Event
        fields = ('id', 'type', 'employee', 'user', 'event_type', 'event_id', 'date', 'verb', 'description')
