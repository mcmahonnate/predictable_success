from rest_framework import serializers
from ..models import Prospect


class ProspectSerializer(serializers.HyperlinkedModelSerializer):
    talent_category_description = serializers.SerializerMethodField()
    engagement_description = serializers.SerializerMethodField()

    def get_talent_category_description(self, obj):
        return obj.talent_category_description

    def get_engagement_description(self, obj):
        return obj.engagement_description

    class Meta:
        model = Prospect
        fields = ('email', 'first_name','last_name', 'talent_category', 'talent_category_description', 'engagement', 'engagement_description',  'created_at')