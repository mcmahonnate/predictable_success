from rest_framework import serializers
from ..models import Customer
from collections import OrderedDict
from rest_framework.fields import SkipField


class CustomerSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        """
        Object instance -> Dict of primitive datatypes.
        """
        ret = OrderedDict()
        fields = [field for field in self.fields.values() if not field.write_only]
        remove_fields = []
        if not instance.show_shareable_checkins:
            remove_fields.extend(['checkin_welcome'])
        if not instance.show_devzones:
            remove_fields.extend(['devzones_welcome','devzones_id_session_intro'])
        if not instance.show_feedback:
            remove_fields.extend(['feedback_welcome', 'feedback_tips', 'feedback_excels_at_question', 'feedback_could_improve_on_question'])
        if not instance.show_projects:
            remove_fields.extend(['projects_welcome'])

        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue

            if not field.field_name in remove_fields:
                representation = field.to_representation(attribute)
                ret[field.field_name] = representation

        return ret

    class Meta:
        model = Customer
        fields = ('id', 'name', 'domain_url', 'show_kolbe', 'show_vops', 'show_mbti', 'show_coaches', 'show_timeline', 'show_kpi', 'show_beta_features', 'show_individual_comp', 'show_shareable_checkins', 'show_feedback', 'show_projects', 'show_devzones', 'show_qualities', 'survey_email_subject', 'survey_email_body', 'feedback_welcome', 'feedback_tips', 'feedback_excels_at_question', 'feedback_could_improve_on_question', 'checkin_welcome', 'projects_welcome', 'devzones_welcome', 'devzones_id_session_intro')

