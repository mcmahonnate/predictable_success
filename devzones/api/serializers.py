from rest_framework import serializers
from org.api.serializers import SanitizedEmployeeSerializer
from ..models import *


class AnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.SerializerMethodField()

    def get_question_text(self, obj):
        return obj.question.text

    class Meta:
        model = Answer
        fields = ('id', 'text', 'question_text')


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ('id', 'text', 'answers')


class ZoneSerializer(serializers.ModelSerializer):

    class Meta:
        model = Zone
        fields = ('id', 'name', 'description', 'order')


class AdviceSerializer(serializers.ModelSerializer):
    employee_zone = ZoneSerializer()
    development_lead_zone = ZoneSerializer()

    class Meta:
        model = Advice
        fields = ('id', 'employee_zone', 'development_lead_zone', 'advice_name_for_employee', 'advice_description_for_employee', 'advice_name_for_development_leader', 'advice_description_for_development_leader', 'alert_type_for_employee', 'alert_for_employee', 'alert_type_for_development_lead', 'alert_for_development_lead')
        read_only_fields = ('employee_zone', 'development_lead_zone')


class CreateEmployeeZoneSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    assessor = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    zone = serializers.PrimaryKeyRelatedField(queryset=Zone.objects.all(), required=False)
    next_question = QuestionSerializer(required=False)
    answers = serializers.PrimaryKeyRelatedField(queryset=Answer.objects.all(), many=True, required=False)
    notes = serializers.CharField(required=False)

    class Meta:
        model = EmployeeZone
        fields = ('id', 'employee', 'assessor', 'next_question', 'zone', 'notes', 'answers')
        read_only_fields = ('next_question', 'notes', 'answers')


class EmployeeZoneSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    assessor = SanitizedEmployeeSerializer()
    zone = ZoneSerializer()
    next_question = QuestionSerializer()
    answers = serializers.SerializerMethodField()
    development_conversation = serializers.PrimaryKeyRelatedField(read_only=True)

    def get_answers(self, obj):
        if obj.completed:
            serializer = AnswerSerializer(context=self.context, many=True)
            return serializer.to_representation(obj.answers)
        else:
            return [answer.id for answer in obj.answers.all()]

    advice = AdviceSerializer(many=True)

    class Meta:
        model = EmployeeZone
        fields = ('id', 'employee', 'assessor', 'next_question', 'zone', 'notes', 'answers', 'date', 'advice', 'completed', 'times_retaken', 'development_conversation')
        
        
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
    meeting_participants = serializers.SerializerMethodField()

    def get_meeting_participants(self, obj):
        if obj.meeting is None or obj.meeting.participants is None:
            return None
        serializer = SanitizedEmployeeSerializer(context=self.context, many=True)
        return serializer.to_representation(obj.meeting.participants)

    class Meta:
        model = Conversation
        fields = ('id', 'employee', 'date', 'development_lead', 'meeting_participants', 'employee_assessment', 'development_lead_assessment', 'completed', 'completed_date')


class UpdateConversationSerializer(serializers.ModelSerializer):
    development_lead_assessment = serializers.PrimaryKeyRelatedField(queryset=EmployeeZone.objects.all())

    class Meta:
        model = Conversation
        fields = ('id', 'development_lead_assessment')


class MeetingSerializer(serializers.ModelSerializer):
    participants = SanitizedEmployeeSerializer(many=True)
    conversations = ConversationSerializer(many=True)

    class Meta:
        model = Meeting
        fields = ('id', 'name', 'date', 'participants', 'conversations', 'completed')