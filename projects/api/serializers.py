from rest_framework import serializers
from org.api.serializers import SanitizedEmployeeSerializer
from ..models import *
from blah.api.serializers import CommentSerializer


class ProjectSerializer(serializers.ModelSerializer):
    sponsors = SanitizedEmployeeSerializer(required=False, many=True)
    owners = SanitizedEmployeeSerializer(required=False, many=True)
    team_members = SanitizedEmployeeSerializer(required=False, many=True)
    comments = CommentSerializer(required=False, many=True)

    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'sponsors', 'owners', 'team_members', 'comments', 'total_score')


class ScoringOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoringOption
        fields = ('id', 'name', 'description', 'value')


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