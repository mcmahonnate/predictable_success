from rest_framework import serializers
from ..models import Comment
from org.api.serializers import MinimalEmployeeSerializer, UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment


class AddCommentSerializer(serializers.Serializer):
    content = serializers.CharField()
    visibility = serializers.IntegerField()
    include_in_daily_digest = serializers.BooleanField()


class SubCommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = UserSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'object_id', 'visibility', 'include_in_daily_digest', 'created_date', 'modified_date')


class EmployeeCommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = UserSerializer()
    associated_object = MinimalEmployeeSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'object_id', 'visibility', 'include_in_daily_digest', 'created_date', 'modified_date', 'associated_object')


class TeamCommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = UserSerializer()
    associated_object = MinimalEmployeeSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'object_id', 'visibility', 'include_in_daily_digest', 'created_date', 'modified_date', 'associated_object')


