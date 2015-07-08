from rest_framework import serializers
from ..models import Team, Employee


class TeamSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team
        fields = ('id', 'name', 'leader')


class MinimalEmployeeSerializer(serializers.HyperlinkedModelSerializer):
    avatar = serializers.SerializerMethodField()
    avatar_small = serializers.SerializerMethodField()
    current_talent_category = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        url = ''
        if obj.avatar:
            url = obj.avatar.url
        return url

    def get_avatar_small(self, obj):
        url = ''
        if obj.avatar_small:
            url = obj.avatar_small.url
        return url

    def get_current_talent_category(self, obj):
        return obj.current_talent_category()

    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'first_name', 'display', 'avatar', 'avatar_small', 'current_talent_category')
