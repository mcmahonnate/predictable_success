from rest_framework import serializers
from org.api.serializers import MinimalEmployeeSerializer
from org.models import Employee
from engagement.models import Happiness
from engagement.api.serializers import HappinessSerializer
from ..models import CheckIn, CheckInType
from todo.api.serializers import TaskSerializer
from blah.api.serializers import CommentSerializer


class CheckInTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckInType
        fields = ('id', 'name')


class CheckInSerializer(serializers.ModelSerializer):
    employee = MinimalEmployeeSerializer(required=False)
    host = MinimalEmployeeSerializer(required=False)
    type = CheckInTypeSerializer(required=False)
    happiness = HappinessSerializer(required=False)
    tasks = TaskSerializer(required=False, many=True)
    summary = serializers.SerializerMethodField()
    comments = CommentSerializer(required=False, many=True)

    def get_summary(self, obj):
        return obj.get_summary(self.context['request'].user)

    class Meta:
        model = CheckIn
        fields = ('id', 'employee', 'host', 'date', 'summary', 'happiness', 'type', 'other_type_description', 'tasks', 'comments')


class AddEditCheckInSerializer(serializers.ModelSerializer):
    host = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), required=False)
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    type = serializers.PrimaryKeyRelatedField(queryset=CheckInType.objects.all())
    happiness = serializers.PrimaryKeyRelatedField(queryset=Happiness.objects.all(), required=False)

    class Meta:
        model = CheckIn
        fields = ('id', 'host', 'employee', 'summary', 'happiness', 'date', 'type', 'other_type_description')

