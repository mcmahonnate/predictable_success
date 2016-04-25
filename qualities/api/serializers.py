from rest_framework import serializers
from ..models import Quality, QualityCluster, PerceivedQuality, PerceptionRequest
from org.api.serializers import SanitizedEmployeeSerializer
from org.models import Employee


class QualitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Quality
        fields = ('id', 'name', 'description')


class QualityClusterSerializer(serializers.ModelSerializer):
    qualities = QualitySerializer(many=True)
    class Meta:
        model = QualityCluster
        fields = ('id', 'name', 'min_choice', 'max_choice', 'qualities')


class MinimalQualityClusterSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualityCluster
        fields = ('id', 'name')


class CreatePerceivedQualitySerializer(serializers.ModelSerializer):
    subject = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    quality = serializers.PrimaryKeyRelatedField(queryset=Quality.objects.all())
    cluster = serializers.PrimaryKeyRelatedField(queryset=QualityCluster.objects.all())

    class Meta:
        model = PerceivedQuality
        fields = ['subject', 'quality', 'cluster']


class PerceivedQualitiesSerializer(serializers.ModelSerializer):
    quality = QualitySerializer()
    cluster = MinimalQualityClusterSerializer()
    reviewer = SanitizedEmployeeSerializer()

    class Meta:
        model = PerceivedQuality
        fields = ('id', 'perception_date', 'reviewer', 'quality', 'cluster')


class PerceptionSerializer(serializers.ModelSerializer):
    cluster = MinimalQualityClusterSerializer()
    reviewer = SanitizedEmployeeSerializer()

    class Meta:
        model = PerceivedQuality
        fields = ('id', 'perception_date', 'reviewer', 'cluster')


class PerceivedQualitiesReportItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    description = serializers.CharField()
    type = serializers.SerializerMethodField()
    count = serializers.SerializerMethodField()
    perceptions = PerceptionSerializer(many=True)

    def get_type(self, obj):
        return obj.type

    def get_count(self, obj):
        return obj.count


class PerceivedQualitiesReportSerializer(serializers.Serializer):
    employee = SanitizedEmployeeSerializer()
    prompts = MinimalQualityClusterSerializer(many=True)
    qualities = PerceivedQualitiesReportItemSerializer(many=True)


class PerceptionRequestSerializer(serializers.ModelSerializer):
    request_date = serializers.DateTimeField(required=False)
    expiration_date = serializers.DateField(required=False)
    requester = SanitizedEmployeeSerializer()
    reviewer = SanitizedEmployeeSerializer()
    category = serializers.PrimaryKeyRelatedField(queryset=QualityCluster.objects.all())

    class Meta:
        model = PerceptionRequest
        fields = ['id', 'request_date', 'expiration_date', 'requester', 'reviewer', 'message', 'has_been_answered', 'was_declined', 'category']


class CreatePerceptionRequestSerializer(serializers.ModelSerializer):
    reviewer = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    message = serializers.CharField(required=False, allow_blank=True)
    category = serializers.PrimaryKeyRelatedField(queryset=QualityCluster.objects.all())

    class Meta:
        model = PerceptionRequest
        fields = ['reviewer', 'message', 'category']
