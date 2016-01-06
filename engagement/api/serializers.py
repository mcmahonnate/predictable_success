from rest_framework import serializers
from org.api.serializers import SanitizedEmployeeSerializer
from org.models import Employee
from blah.api.serializers import EmployeeCommentSerializer
from ..models import Happiness, SurveyUrl


# class HappinessSerializer(serializers.ModelSerializer):
#     assessed_by = MinimalEmployeeSerializer()
#     employee = MinimalEmployeeSerializer() 
#     display = serializers.SerializerMethodField()

#     def get_display(self, obj):
#         return obj.get_happiness_display()

#     class Meta:
#         model = Happiness
#         fields = ('id', 'assessed_by', 'employee', 'assessed_date', 'assessment', 'comment')


class AddEditHappinessSerializer(serializers.ModelSerializer):
    assessed_by = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), required=False)
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())

    class Meta:
        model = Happiness
        fields = ('id', 'assessed_by', 'employee', 'assessed_date', 'assessment', 'comment')


class SurveyUrlSerializer(serializers.HyperlinkedModelSerializer):
    sent_from = SanitizedEmployeeSerializer()
    sent_to = SanitizedEmployeeSerializer()

    class Meta:
        model = SurveyUrl
        fields = ('id', 'sent_from', 'sent_to', 'url', 'active', 'completed', 'sent_date')


class HappinessSerializer(serializers.HyperlinkedModelSerializer):
    assessed_by = SanitizedEmployeeSerializer()
    employee = SanitizedEmployeeSerializer()
    comment = EmployeeCommentSerializer()

    def get_assessment_verbose(self, obj):
        return obj.assessment_verbose

    class Meta:
        model = Happiness
        fields = ('id', 'employee', 'assessment', 'assessment_verbose', 'assessed_by', 'assessed_date', 'comment')
