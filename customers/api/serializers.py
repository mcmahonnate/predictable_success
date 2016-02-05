from rest_framework import serializers
from ..models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'name', 'domain_url', 'show_kolbe', 'show_vops', 'show_mbti', 'show_coaches', 'show_timeline', 'show_kpi', 'show_beta_features', 'show_individual_comp', 'show_shareable_checkins', 'show_feedback', 'show_projects', 'show_devzones', 'survey_email_subject', 'survey_email_body', 'feedback_welcome', 'feedback_tips', 'feedback_excels_at_question', 'feedback_could_improve_on_question', 'checkin_welcome', 'projects_welcome', 'devzones_welcome', 'devzones_id_session_intro')


