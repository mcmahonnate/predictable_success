from rest_framework import serializers
from org.api.serializers import MinimalEmployeeSerializer
from ..models import AssessmentType, AssessmentCategory, EmployeeAssessment, MBTI


class AssessmentTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = AssessmentType
        fields = ('id', 'name')


class AssessmentCategorySerializer(serializers.ModelSerializer):
    assessment = AssessmentTypeSerializer()

    class Meta:
        model = AssessmentCategory
        fields = ('id', 'name', 'assessment')


class AssessmentSerializer(serializers.ModelSerializer):
    employee = MinimalEmployeeSerializer()
    category = AssessmentCategorySerializer()
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    def get_name(self, obj):
         try:
            name = obj.get_name
            return name
         except:
             return None

    def get_description(self, obj):
         try:
            description = obj.get_description
            return description
         except:
             return None

    class Meta:
        model = EmployeeAssessment
        fields = ('id', 'employee', 'score', 'category', 'name', 'description')


class MBTISerializer(serializers.HyperlinkedModelSerializer):
    employee = MinimalEmployeeSerializer()
    description = serializers.SerializerMethodField()

    def get_description(self, obj):
        return obj.get_description

    class Meta:
        model = MBTI
        fields = ('employee', 'type', 'description')


class MBTIReportSerializer(serializers.Serializer):
    type = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    mbtis = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    total_assessed = serializers.SerializerMethodField()
    total_not_assessed = serializers.SerializerMethodField()

    def get_type(self, obj):
        return obj.team_type.type

    def get_description(self, obj):
        return obj.team_type.description

    def get_mbtis(self, obj):
        return obj.mbtis

    def get_total(self, obj):
        return obj.total

    def get_total_assessed(self, obj):
        return obj.total_assessed

    def get_total_not_assessed(self, obj):
        return obj.total_not_assessed

