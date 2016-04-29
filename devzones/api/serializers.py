from blah.api.serializers import CommentSerializer
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
        fields = ('id', 'name', 'description', 'order', 'value')


class AdviceForEmployeeSerializer(serializers.ModelSerializer):
    employee_zone = ZoneSerializer()

    class Meta:
        model = Advice
        fields = ('id', 'employee_zone', 'advice_name_for_employee', 'advice_description_for_employee', 'alert_type_for_employee', 'alert_for_employee')


class AdviceSerializer(serializers.ModelSerializer):
    employee_zone = ZoneSerializer()
    development_lead_zone = ZoneSerializer()

    class Meta:
        model = Advice
        fields = ('id', 'employee_zone', 'development_lead_zone', 'advice_name_for_employee', 'advice_description_for_employee', 'advice_name_for_development_leader', 'advice_description_for_development_leader', 'alert_type_for_employee', 'alert_for_employee', 'alert_for_employee_short', 'alert_type_for_development_lead', 'alert_for_development_lead', 'alert_for_development_lead_short', 'severity')
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
        fields = ('id', 'employee', 'assessor', 'next_question', 'zone', 'notes', 'answers', 'is_draft')
        read_only_fields = ('next_question', 'answers')


class EmployeeZoneReportSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    assessor = SanitizedEmployeeSerializer()
    zone = ZoneSerializer()
    next_question = QuestionSerializer()
    answers = serializers.SerializerMethodField()
    meeting_name = serializers.SerializerMethodField()
    development_lead = serializers.SerializerMethodField()
    conversation_zone = serializers.SerializerMethodField()
    conversation_completed = serializers.SerializerMethodField()
    conversation_completed_date = serializers.SerializerMethodField()
    conversation_gap = serializers.SerializerMethodField()
    conversation_gap_severity = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    def get_date(self, obj):
        if obj.completed:
            return obj.date
        return None


    def get_conversation_zone(self, obj):
        try:
            serializer = ZoneSerializer(context=self.context)
            if obj.development_conversation.development_lead_assessment and \
                    obj.development_conversation.development_lead_assessment.zone:
                return serializer.to_representation(obj.development_conversation.development_lead_assessment.zone)
        except Conversation.DoesNotExist:
            return None
        except EmployeeZone.DoesNotExist:
            return None
        except Zone.DoesNotExist:
            return None

    def get_conversation_gap(self, obj):
        try:
            if obj.development_conversation.advice.count() > 0:
                return obj.development_conversation.advice[0].alert_for_development_lead_short
            return None
        except Conversation.DoesNotExist:
            return None

    def get_conversation_gap_severity(self, obj):
        try:
            if obj.development_conversation.advice.count() > 0:
                return obj.development_conversation.advice[0].severity
            return None
        except Conversation.DoesNotExist:
            return None

    def get_conversation_completed(self, obj):
        try:
            return obj.development_conversation.completed
        except Conversation.DoesNotExist:
            return None

    def get_conversation_completed_date(self, obj):
        try:
            if obj.development_conversation.completed:
                return obj.development_conversation.date
            return None
        except Conversation.DoesNotExist:
            return None

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
        fields = ('id', 'employee', 'assessor', 'next_question', 'zone', 'answers', 'date', 'completed', 'times_retaken', 'development_lead', 'new_employee', 'meeting_name', 'conversation_completed', 'conversation_completed_date', 'conversation_gap', 'conversation_gap_severity', 'conversation_zone')


class EmployeeZoneSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    assessor = SanitizedEmployeeSerializer()
    zone = ZoneSerializer()
    zones = ZoneSerializer(many=True)
    next_question = QuestionSerializer()
    answers = serializers.SerializerMethodField()
    development_conversation = serializers.PrimaryKeyRelatedField(read_only=True)
    development_lead = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

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
        fields = ('id', 'active', 'employee', 'assessor', 'next_question', 'zone', 'zones', 'notes', 'answers', 'date', 'completed', 'times_retaken', 'development_conversation', 'new_employee', 'development_lead', 'is_draft', 'comments')


class MinimalEmployeeZoneSerializer(serializers.ModelSerializer):
    assessor = SanitizedEmployeeSerializer()
    conversation_id = serializers.SerializerMethodField()
    employee = SanitizedEmployeeSerializer()
    zone = ZoneSerializer()

    def get_conversation_id(self, obj):
        try:
            if obj.employee.id == obj.assessor.id:
                conversation = obj.development_conversation
            else:
                conversation = obj.development_led_conversation
        except Conversation.DoesNotExist:
            return None
        return conversation.id

    class Meta:
        model = EmployeeZone
        fields = ('id', 'employee', 'assessor', 'zone', 'notes', 'date', 'active', 'is_draft', 'completed', 'conversation_id')


class EmployeeZoneForActivityFeedSerializer(MinimalEmployeeZoneSerializer):
    comments = CommentSerializer(many=True)

    class Meta:
        model = EmployeeZone
        fields = ('id', 'employee', 'assessor', 'zone', 'notes', 'date', 'active', 'is_draft', 'completed', 'conversation_id', 'comments')


class EmployeeZoneDevelopmentLeadSerializer(EmployeeZoneSerializer):
    notes = serializers.SerializerMethodField()

    def get_notes(self, obj):
        if obj.is_draft or obj.completed:
            return obj.notes
        else:
            return None


class UpdateEmployeeZoneSerializer(serializers.ModelSerializer):
    assessor = serializers.PrimaryKeyRelatedField(required=False, queryset=Employee.objects.all(), allow_null=False)
    last_question_answered = serializers.PrimaryKeyRelatedField(required=False, queryset=Question.objects.all(), allow_null=True)
    answers = serializers.PrimaryKeyRelatedField(required=False, queryset=Answer.objects.all(), many=True, allow_null=True)
    zone = serializers.PrimaryKeyRelatedField(required=False, queryset=Zone.objects.all(), allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    completed = serializers.BooleanField(required=False)
    date = serializers.DateTimeField(required=False)

    class Meta:
        model = EmployeeZone
        fields = ('id', 'assessor', 'last_question_answered', 'answers', 'zone', 'notes', 'completed', 'date', 'is_draft')


class MinimalConversationSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    development_lead = SanitizedEmployeeSerializer()
    employee_assessment = MinimalEmployeeZoneSerializer()
    development_lead_assessment = MinimalEmployeeZoneSerializer()
    advice = AdviceSerializer(many=True)

    class Meta:
        model = Conversation
        fields = ('id', 'employee', 'date', 'development_lead', 'employee_assessment', 'development_lead_assessment', 'advice', 'completed', 'completed_date')


class ConversationSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    development_lead = SanitizedEmployeeSerializer()
    employee_assessment = EmployeeZoneSerializer()
    development_lead_assessment = EmployeeZoneSerializer()
    meeting_participants = serializers.SerializerMethodField()
    advice = AdviceSerializer(many=True)

    def get_meeting_participants(self, obj):
        if obj.meeting is None or obj.meeting.participants is None:
            return None
        serializer = SanitizedEmployeeSerializer(context=self.context, many=True)
        return serializer.to_representation(obj.meeting.participants)

    class Meta:
        model = Conversation
        fields = ('id', 'employee', 'date', 'development_lead', 'meeting_participants', 'employee_assessment', 'development_lead_assessment', 'advice', 'completed', 'completed_date')


class ConversationDevelopmentLeadSerializer(ConversationSerializer):
    development_lead_assessment = EmployeeZoneDevelopmentLeadSerializer()


class ConversationForEmployeeSerializer(ConversationSerializer):
    development_lead_assessment = serializers.SerializerMethodField()
    advice = AdviceForEmployeeSerializer(many=True)

    def get_development_lead_assessment(self, obj):
        if obj.development_lead_assessment is not None and \
                obj.development_lead_assessment.completed:
            serializer = EmployeeZoneSerializer(context=self.context, many=False)
            return serializer.to_representation(obj.development_lead_assessment)
        return None


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
    development_lead = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), required=False)
    development_lead_assessment = serializers.PrimaryKeyRelatedField(queryset=EmployeeZone.objects.all(), required=False)
    meeting = serializers.PrimaryKeyRelatedField(queryset=Meeting.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Conversation
        fields = ('id', 'development_lead', 'development_lead_assessment', 'meeting')


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
        fields = ('id', 'name', 'participants', 'active')


class MeetingSerializer(serializers.ModelSerializer):
    participants = SanitizedEmployeeSerializer(many=True)
    conversations = MinimalConversationSerializer(many=True)

    class Meta:
        model = Meeting
        fields = ('id', 'name', 'date', 'participants', 'conversations', 'completed', 'active')


class SanitizedMeetingSerializer(serializers.ModelSerializer):
    participants = SanitizedEmployeeSerializer(many=True)
    selfies_completed = serializers.SerializerMethodField()
    selfies_total = serializers.SerializerMethodField()

    def get_selfies_completed(self, obj):
        return obj.conversations.filter(employee_assessment__completed=True).count()

    def get_selfies_total(self, obj):
        return obj.conversations.count()

    class Meta:
        model = Meeting
        fields = ('id', 'name', 'date', 'participants', 'completed', 'selfies_completed' , 'selfies_total', 'active')