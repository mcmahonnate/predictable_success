from blah.api.serializers import CommentSerializer
from rest_framework import serializers
from org.api.serializers import SanitizedEmployeeSerializer
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


class CreateEmployeeLeadershipStyleSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    assessor = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    next_question = QuestionSerializer(required=False)
    answers = serializers.PrimaryKeyRelatedField(queryset=Answer.objects.all(), many=True, required=False)
    notes = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = EmployeeLeadershipStyle
        fields = ('id', 'employee', 'assessor', 'next_question', 'notes', 'answers', 'is_draft')
        read_only_fields = ('next_question', 'answers')


class EmployeeLeadershipStyleReportSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    assessor = SanitizedEmployeeSerializer()
    date = serializers.SerializerMethodField()

    def get_date(self, obj):
        if obj.completed:
            return obj.date
        return None

    class Meta:
        model = EmployeeLeadershipStyle
        fields = ('id', 'employee', 'assessor', 'date', 'completed', 'times_retaken')


class EmployeeLeadershipStyleSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    assessor = SanitizedEmployeeSerializer()
    next_question = QuestionSerializer()
    answers = serializers.SerializerMethodField()

    def get_answers(self, obj):
        if obj.completed:
            serializer = AnswerSerializer(context=self.context, many=True)
            return serializer.to_representation(obj.answers)
        else:
            return [answer.id for answer in obj.answers.all()]

    class Meta:
        model = EmployeeLeadershipStyle
        fields = ('id', 'active', 'employee', 'assessor', 'next_question', 'notes', 'answers', 'date', 'completed', 'times_retaken', 'is_draft')


class MinimalEmployeeLeadershipStyleSerializer(serializers.ModelSerializer):
    assessor = SanitizedEmployeeSerializer()
    employee = SanitizedEmployeeSerializer()

    class Meta:
        model = EmployeeLeadershipStyle
        fields = ('id', 'employee', 'assessor', 'notes', 'date', 'active', 'is_draft', 'completed')


class EmployeeLeadershipStyleForActivityFeedSerializer(MinimalEmployeeLeadershipStyleSerializer):

    class Meta:
        model = EmployeeLeadershipStyle
        fields = ('id', 'employee', 'assessor', 'zone', 'notes', 'date', 'active', 'is_draft', 'completed')


class UpdateEmployeeLeadershipStyleSerializer(serializers.ModelSerializer):
    assessor = serializers.PrimaryKeyRelatedField(required=False, queryset=Employee.objects.all(), allow_null=False)
    last_question_answered = serializers.PrimaryKeyRelatedField(required=False, queryset=Question.objects.all(), allow_null=True)
    answers = serializers.PrimaryKeyRelatedField(required=False, queryset=Answer.objects.all(), many=True, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    completed = serializers.BooleanField(required=False)
    date = serializers.DateTimeField(required=False)

    class Meta:
        model = EmployeeLeadershipStyle
        fields = ('id', 'assessor', 'last_question_answered', 'answers', 'notes', 'completed', 'date', 'is_draft')