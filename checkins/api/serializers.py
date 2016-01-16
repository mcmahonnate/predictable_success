from rest_framework import serializers
from org.api.serializers import SanitizedEmployeeSerializer
from org.models import Employee
from engagement.models import Happiness
from engagement.api.serializers import HappinessSerializer
from ..models import CheckIn, CheckInType, CheckInRequest
from todo.api.serializers import TaskSerializer
from blah.api.serializers import CommentSerializer


class CheckInTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckInType
        fields = ('id', 'name')


class SanitizedCheckInSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer(required=False)
    host = SanitizedEmployeeSerializer(required=False)
    type = CheckInTypeSerializer(required=False)
    happiness = HappinessSerializer(required=False)

    class Meta:
        model = CheckIn
        fields = ('id', 'employee', 'host', 'date', 'happiness', 'type', 'other_type_description', 'published', 'visible_to_employee')


class CreateCheckInRequestSerializer(serializers.ModelSerializer):
    host = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())

    class Meta:
        model = CheckInRequest
        fields = ['host']


class CheckInSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer(required=False)
    host = SanitizedEmployeeSerializer(required=False)
    type = CheckInTypeSerializer(required=False)
    happiness = HappinessSerializer(required=False)
    tasks = TaskSerializer(required=False, many=True)
    comments = CommentSerializer(required=False, many=True)

    class Meta:
        model = CheckIn
        fields = ('id', 'employee', 'host', 'date', 'summary', 'happiness', 'type', 'other_type_description', 'tasks', 'comments', 'published', 'visible_to_employee')


class CheckInRequestSerializer(serializers.ModelSerializer):
    request_date = serializers.DateTimeField(required=False)
    requester = SanitizedEmployeeSerializer()
    host = SanitizedEmployeeSerializer()

    class Meta:
        model = CheckInRequest
        fields = ['id', 'request_date', 'requester', 'host', 'has_been_answered']


class EmployeeCheckInSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer(required=False)
    host = SanitizedEmployeeSerializer(required=False)
    type = CheckInTypeSerializer(required=False)

    class Meta:
        model = CheckIn
        fields = ('id', 'employee', 'host', 'date', 'summary', 'type', 'other_type_description', 'published')


class SharedEmployeeCheckInSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer(required=False)
    host = SanitizedEmployeeSerializer(required=False)
    type = CheckInTypeSerializer(required=False)
    comments = CommentSerializer(required=False, many=True)

    class Meta:
        model = CheckIn
        fields = ('id', 'employee', 'host', 'date', 'summary', 'type', 'other_type_description', 'comments', 'published')


class AddEditCheckInSerializer(serializers.ModelSerializer):
    host = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), required=False)
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    type = serializers.PrimaryKeyRelatedField(queryset=CheckInType.objects.all())
    happiness = serializers.PrimaryKeyRelatedField(queryset=Happiness.objects.all(), required=False)

    class Meta:
        model = CheckIn
        fields = ('id', 'host', 'employee', 'summary', 'happiness', 'date', 'type', 'other_type_description', 'published')

