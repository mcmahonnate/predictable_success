from rest_framework import serializers
from ..models import Comment
from org.api.serializers import SanitizedEmployeeSerializer, SimpleUserSerializer


class SubCommentSerializer(serializers.ModelSerializer):
    owner = SimpleUserSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'content_type', 'object_id', 'visibility', 'include_in_daily_digest', 'created_date', 'modified_date')
        read_only_fields = ('id', 'owner', 'content_type', 'object_id', 'created_date')


class CommentSerializer(serializers.ModelSerializer):
    owner = SimpleUserSerializer(read_only=True)
    replies = SubCommentSerializer(read_only=True, many=True)

    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'content_type', 'object_id', 'visibility', 'include_in_daily_digest', 'created_date', 'modified_date', 'replies')
        read_only_fields = ('id', 'owner', 'content_type', 'object_id', 'created_date', 'replies')


class CreateCommentSerializer(serializers.Serializer):
    content = serializers.CharField()
    visibility = serializers.IntegerField(required=False)
    include_in_daily_digest = serializers.BooleanField(required=False, default=False)


class EmployeeCommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = SimpleUserSerializer()
    associated_object = SanitizedEmployeeSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'object_id', 'visibility', 'include_in_daily_digest', 'created_date', 'modified_date', 'associated_object')


class TeamCommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = SimpleUserSerializer()
    associated_object = SanitizedEmployeeSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'object_id', 'visibility', 'include_in_daily_digest', 'created_date', 'modified_date', 'associated_object')


