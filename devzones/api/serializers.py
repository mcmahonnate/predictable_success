from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from org.api.serializers import SanitizedEmployeeSerializer, EmployeeSerializer
from ..models import *


class AnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.SerializerMethodField()
    question_order = serializers.SerializerMethodField()

    def get_question_text(self, obj):
        return obj.question.text

    def get_question_order(self, obj):
        return obj.question.order

    class Meta:
        model = Answer
        fields = ('id', 'text', 'question_text', 'question_order')


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
    notes = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = EmployeeZone
        fields = ('id', 'employee', 'assessor', 'next_question', 'zone', 'notes', 'answers')
        read_only_fields = ('next_question', 'answers')


class EmployeeZoneReportSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer()
    assessor = SanitizedEmployeeSerializer()
    zone = ZoneSerializer()
    next_question = QuestionSerializer()
    answers = serializers.SerializerMethodField()
    meeting_name = serializers.SerializerMethodField()
    development_lead = serializers.SerializerMethodField()

    def get_answers(self, obj):
        if obj.completed:
            serializer = AnswerSerializer(context=self.context, many=True)
            return serializer.to_representation(obj.answers)
        else:
            return [answer.id for answer in obj.answers.all()]

    def get_development_lead(self, obj):
        try:
            serializer = SanitizedEmployeeSerializer(context=self.context)
            return serializer.to_representation(obj.development_conversation.development_lead)
        except (AttributeError, ObjectDoesNotExist):
            return None

    def get_meeting_name(self, obj):
        try:
            return obj.development_conversation.meeting.name
        except (AttributeError, ObjectDoesNotExist):
            return None

    class Meta:
        model = EmployeeZone
        fields = ('id', 'employee', 'assessor', 'next_question', 'zone', 'notes', 'answers', 'date', 'completed', 'times_retaken', 'development_lead', 'new_employee', 'meeting_name')


class EmployeeZoneSerializer(serializers.ModelSerializer):
    advice = AdviceSerializer(many=True)
    employee = SanitizedEmployeeSerializer()
    assessor = SanitizedEmployeeSerializer()
    zone = ZoneSerializer()
    zones = ZoneSerializer(many=True)
    next_question = QuestionSerializer()
    answers = serializers.SerializerMethodField()
    development_conversation = serializers.PrimaryKeyRelatedField(read_only=True)
    development_lead = serializers.SerializerMethodField()

    def get_answers(self, obj):
        if obj.completed:
            serializer = AnswerSerializer(context=self.context, many=True)
            return serializer.to_representation(obj.answers)
        else:
            return [answer.id for answer in obj.answers.all()]

    def get_development_lead(self, obj):
        try:
            serializer = SanitizedEmployeeSerializer(context=self.context)
            return serializer.to_representation(obj.development_conversation.development_lead)
        except AttributeError:
            return None

    class Meta:
        model = EmployeeZone
        fields = ('id', 'employee', 'assessor', 'next_question', 'zone', 'zones', 'notes', 'answers', 'date', 'advice', 'completed', 'times_retaken', 'development_conversation', 'new_employee', 'development_lead')
        
        
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


class SanitizedConversationSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    development_lead = SanitizedEmployeeSerializer()
    employee_assessment = EmployeeZoneSerializer()
    meeting_participants = serializers.SerializerMethodField()

    def get_meeting_participants(self, obj):
        if obj.meeting is None or obj.meeting.participants is None:
            return None
        serializer = SanitizedEmployeeSerializer(context=self.context, many=True)
        return serializer.to_representation(obj.meeting.participants)

    class Meta:
        model = Conversation
        fields = ('id', 'employee', 'date', 'development_lead', 'meeting_participants', 'employee_assessment', 'completed', 'completed_date')


class UpdateConversationSerializer(serializers.ModelSerializer):
    development_lead_assessment = serializers.PrimaryKeyRelatedField(queryset=EmployeeZone.objects.all())

    class Meta:
        model = Conversation
        fields = ('id', 'development_lead_assessment')


class CreateConversationSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    development_lead = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    meeting = serializers.PrimaryKeyRelatedField(queryset=Meeting.objects.all())

    class Meta:
        model = Conversation
        fields = ('id', 'employee', 'development_lead', 'meeting')


class CreateUpdateMeetingSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    participants = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), many=True)

    class Meta:
        model = Meeting
        fields = ('id', 'name', 'participants')


class MeetingSerializer(serializers.ModelSerializer):
    participants = SanitizedEmployeeSerializer(many=True)
    conversations = ConversationSerializer(many=True)

    class Meta:
        model = Meeting
        fields = ('id', 'name', 'date', 'participants', 'conversations', 'completed')


class SanitizedMeetingSerializer(serializers.ModelSerializer):
    participants = SanitizedEmployeeSerializer(many=True)

    class Meta:
        model = Meeting
        fields = ('id', 'name', 'date', 'participants', 'completed')