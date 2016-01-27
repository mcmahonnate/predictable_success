from rest_framework import serializers
from org.api.serializers import SanitizedEmployeeSerializer
from ..models import *
from blah.api.serializers import CommentSerializer


class CreateUpdateProjectSerializer(serializers.ModelSerializer):
    sponsors = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), many=True)
    owners = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), many=True)
    team_members = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), many=True)
    scores = serializers.PrimaryKeyRelatedField(queryset=ScoringOption.objects.all(), many=True)
    description = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'sponsors', 'owners', 'team_members', 'scores']


class ScoringOptionSerializer(serializers.ModelSerializer):
    criteria_id = serializers.SerializerMethodField()
    criteria_name = serializers.SerializerMethodField()

    def get_criteria_id(self, obj):
        return obj.criteria.id

    def get_criteria_name(self, obj):
        return obj.criteria.name

    class Meta:
        model = ScoringOption
        fields = ('id', 'name', 'description', 'value', 'criteria_id', 'criteria_name')


class ScoringCriteriaSerializer(serializers.ModelSerializer):
    options = ScoringOptionSerializer(many=True)

    class Meta:
        model = ScoringCriteria
        fields = ('id', 'name', 'description', 'options')


class PrioritizationRuleSerializer(serializers.ModelSerializer):
    criteria = ScoringCriteriaSerializer(many=True)

    class Meta:
        model = PrioritizationRule
        fields = ('id', 'date', 'description', 'criteria')


class ProjectSerializer(serializers.ModelSerializer):
    sponsors = SanitizedEmployeeSerializer(required=False, many=True)
    owners = SanitizedEmployeeSerializer(required=False, many=True)
    team_members = SanitizedEmployeeSerializer(required=False, many=True)
    comments = CommentSerializer(required=False, many=True)
    description = serializers.SerializerMethodField()
    scores = ScoringOptionSerializer(many=True)

    def get_description(self, obj):
        if obj.description is None:
            return ''
        else:
            return obj.description

    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'sponsors', 'owners', 'team_members', 'comments', 'scores', 'total_score')

