from rest_framework import serializers
from org.api.serializers import SanitizedEmployeeSerializer, SimpleUserSerializer, MinimalEmployeeSerializer
from django.contrib.contenttypes.models import ContentType
from blah.models import Comment
from blah.api.serializers import CommentSerializer
from checkins.models import CheckIn
from checkins.api.serializers import CheckInSerializer, SanitizedCheckInSerializer
from devzones.models import EmployeeZone
from devzones.api.serializers import EmployeeZoneForActivityFeedSerializer
from feedback.models import FeedbackDigest
from feedback.api.serializers import SummarizedFeedbackDigestSerializer
from ..models import Event
from django.utils.log import getLogger

logger = getLogger('talentdashboard')


class EventSerializer(serializers.ModelSerializer):
    employee = MinimalEmployeeSerializer()
    user = SimpleUserSerializer()
    type = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    verb = serializers.SerializerMethodField()
    related_object = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        super(serializers.ModelSerializer, self).__init__(*args, **kwargs)
        self.related_objects = {}
        self.related_object_serializers = {
            Comment: CommentSerializer,
            CheckIn: CheckInSerializer,
            EmployeeZone: EmployeeZoneForActivityFeedSerializer,
            FeedbackDigest: SummarizedFeedbackDigestSerializer
        }

    def get_related_objects(self, instance):
        ids = {}
        objects = {}
        if self.parent and self.parent.many:
            for event in instance:
                if event.event_type not in ids:
                    ids[event.event_type] = []
                ids[event.event_type].append(event.event_id)
            for k, v in ids.iteritems():
                objects[k] = {}
                model = k.model_class()
                items = model.objects.filter(pk__in=v)
                for item in items:
                    objects[k][item.id] = item
        else:
            model = instance.event_type.model_class()
            item = model.objects.get(pk=instance.event_id)
            objects[instance.event_type] = {instance.event_id: item}
        return objects

    def get_related_object(self, obj):
        if not self.related_objects:
            self.related_objects = self.get_related_objects(self.instance)
        if obj.event_type not in self.related_objects:
            return None
        if obj.event_id not in self.related_objects[obj.event_type]:
            return None

        related_object = self.related_objects[obj.event_type][obj.event_id]
        if related_object is None:
            return None

        serializer = self.get_serializer_for_related_object(related_object, obj.show_conversation)
        return serializer.to_representation(related_object)

    def get_serializer_for_related_object(self, obj, show_conversation):
        serializer = self.related_object_serializers[obj.__class__]
        if serializer is CheckInSerializer and not show_conversation:
            serializer = SanitizedCheckInSerializer
        return serializer(context=self.context)

    def get_type(self, obj):
        return obj.event_type.name

    def get_description(self, obj):
        return obj.description(self.context['request'].user)

    def get_verb(self, obj):
        return obj.verb()

    class Meta:
        model = Event
        fields = ('id', 'type', 'employee', 'user', 'event_type', 'event_id', 'date', 'verb', 'description', 'related_object', 'show_conversation')
