from rest_framework import serializers
from ..models import UserPreferences


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = ('dashboard_view', 'show_checkin_intro_pop', 'show_devzone_intro_pop',
                  'show_feedback_intro_pop', 'show_strengths_intro_pop')



