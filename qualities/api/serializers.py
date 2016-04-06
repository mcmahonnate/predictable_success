from rest_framework import serializers
from ..models import Quality, QualityCluster, PerceivedQuality
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


class QualityClusterListSerializer(serializers.ModelSerializer):
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
    cluster = QualityClusterListSerializer()
    reviewer = SanitizedEmployeeSerializer()

    class Meta:
        model = PerceivedQuality
        fields = ('id', 'perception_date', 'reviewer', 'quality', 'cluster')


class PerceptionSerializer(serializers.ModelSerializer):
    cluster = QualityClusterListSerializer()
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
    qualities = PerceivedQualitiesReportItemSerializer(many=True)
