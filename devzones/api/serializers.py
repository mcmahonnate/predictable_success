from rest_framework import serializers
from org.api.serializers import SanitizedEmployeeSerializer
from ..models import *


class CreateEmployeeZoneSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())

    class Meta:
        model = EmployeeZone
        fields = ('id', 'employee')


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


class EmployeeZoneSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    zone = ZoneSerializer()
    next_question = QuestionSerializer()
    answers = AnswerSerializer(many=True)

    class Meta:
        model = EmployeeZone
        fields = ('id', 'employee', 'next_question', 'zone', 'notes', 'answers')
        
        
class UpdateEmployeeZoneSerializer(serializers.ModelSerializer):
    next_question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())
    answers = serializers.PrimaryKeyRelatedField(queryset=Answer.objects.all(), many=True)

    class Meta:
        model = EmployeeZone
        fields = ('id', 'next_question', 'answers', 'notes')