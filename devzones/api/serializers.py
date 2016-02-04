from rest_framework import serializers
from org.api.serializers import SanitizedEmployeeSerializer
from ..models import *


class AnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = ('id', 'text')


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ('id', 'text', 'answers')


class ZoneSerializer(serializers.ModelSerializer):

    class Meta:
        model = Zone
        fields = ('id', 'name', 'description')


class AdviceSerializer(serializers.ModelSerializer):
    employee_zone = ZoneSerializer()
    development_lead_zone = ZoneSerializer()

    class Meta:
        model = Advice
        fields = ('id', 'employee_zone', 'development_lead_zone', 'advice_name_for_employee', 'advice_description_for_employee', 'advice_name_for_development_leader', 'advice_description_for_development_leader')
        read_only_fields = ('employee_zone', 'development_lead_zone')


class CreateEmployeeZoneSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    assessor = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    zone = ZoneSerializer(required=False)
    next_question = QuestionSerializer(required=False)
    answers = serializers.PrimaryKeyRelatedField(queryset=Answer.objects.all(), many=True, required=False)
    notes = serializers.CharField(required=False)

    class Meta:
        model = EmployeeZone
        fields = ('id', 'employee', 'assessor', 'next_question', 'zone', 'notes', 'answers')
        read_only_fields = ('next_question', 'zone', 'notes', 'answers')


class EmployeeZoneSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    zone = ZoneSerializer()
    next_question = QuestionSerializer()
    answers = serializers.PrimaryKeyRelatedField(queryset=Answer.objects.all(), many=True)
    advice = AdviceSerializer(many=True)
    #retaken_count =

    class Meta:
        model = EmployeeZone
        fields = ('id', 'employee', 'next_question', 'zone', 'notes', 'answers', 'date', 'advice')
        
        
class UpdateEmployeeZoneSerializer(serializers.ModelSerializer):
    last_question_answered = serializers.PrimaryKeyRelatedField(required=False, queryset=Question.objects.all(), allow_null=True)
    answers = serializers.PrimaryKeyRelatedField(required=False, queryset=Answer.objects.all(), many=True, allow_null=True)
    zone = serializers.PrimaryKeyRelatedField(required=False, queryset=Zone.objects.all(), allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    completed = serializers.BooleanField(required=False)
    date = serializers.DateTimeField(required=False)

    class Meta:
        model = EmployeeZone
        fields = ('id', 'last_question_answered', 'answers', 'zone', 'notes', 'completed', 'date')


class ConversationSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    development_lead = SanitizedEmployeeSerializer()
    employee_assessment = EmployeeZoneSerializer()
    development_lead_assessment = EmployeeZoneSerializer()

    class Meta:
        model = Conversation
        fields = ('id', 'employee', 'date', 'development_lead', 'employee_assessment', 'development_lead_assessment', 'completed', 'completed_date')