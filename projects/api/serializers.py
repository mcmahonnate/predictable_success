from rest_framework import serializers
from org.api.serializers import SanitizedEmployeeSerializer
from ..models import Project
from blah.api.serializers import CommentSerializer


class ProjectSerializer(serializers.ModelSerializer):
    sponsors = SanitizedEmployeeSerializer(required=False, many=True)
    owners = SanitizedEmployeeSerializer(required=False, many=True)
    team_members = SanitizedEmployeeSerializer(required=False, many=True)
    comments = CommentSerializer(required=False, many=True)

    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'sponsors', 'owners', 'team_members', 'comments')
