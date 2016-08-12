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
    answer = serializers.SerializerMethodField()

    def get_answer(self, obj):
        if obj.answer is None:
            return None
        serializer = AnswerSerializer(context=self.context)
        return serializer.to_representation(obj.answer)

    class Meta:
        model = Question
        fields = ('id', 'text', 'answers', 'answer')


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
    next_question = serializers.SerializerMethodField()
    answers = serializers.SerializerMethodField()

    def get_next_question(self, obj):
        next_question = obj.next_question()
        if next_question is None:
            return None
        for answer in obj.answers.all():
            if next_question.id == answer.question.id:
                next_question.answer = answer
        serializer = QuestionSerializer(context=self.context)
        return serializer.to_representation(next_question)

    def get_answers(self, obj):
        if obj.completed:
            serializer = AnswerSerializer(context=self.context, many=True)
            return serializer.to_representation(obj.answers)
        else:
            return [answer.id for answer in obj.answers.all()]

    class Meta:
        model = EmployeeLeadershipStyle
        fields = ('id', 'active', 'employee', 'assessor', 'next_question', 'notes', 'answers', 'date',
                  'total_questions', 'total_answered', 'completed', 'times_retaken', 'is_draft',
                  'visionary_score', 'operator_score', 'processor_score', 'synergist_score')


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