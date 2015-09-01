from rest_framework import serializers
from ..models import Comment
from org.api.serializers import MinimalEmployeeSerializer, SimpleUserSerializer


class CommentSerializer(serializers.ModelSerializer):
    owner = SimpleUserSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'content_type', 'object_id', 'visibility', 'include_in_daily_digest', 'created_date', 'modified_date')


class AddCommentSerializer(serializers.Serializer):
    content = serializers.CharField()
    visibility = serializers.IntegerField()
    include_in_daily_digest = serializers.BooleanField()


class SubCommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = SimpleUserSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'object_id', 'visibility', 'include_in_daily_digest', 'created_date', 'modified_date')


class EmployeeCommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = SimpleUserSerializer()
    associated_object = MinimalEmployeeSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'object_id', 'visibility', 'include_in_daily_digest', 'created_date', 'modified_date', 'associated_object')


class TeamCommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = SimpleUserSerializer()
    associated_object = MinimalEmployeeSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'object_id', 'visibility', 'include_in_daily_digest', 'created_date', 'modified_date', 'associated_object')


