from rest_framework import serializers
from talentdashboard.views.serializers import MinimalEmployeeSerializer
from org.models import Employee
from engagement.models import Happiness
from ..models import CheckIn, CheckInType


class CheckInTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckInType
        fields = ('id', 'name')


class CheckInSerializer(serializers.ModelSerializer):
    employee = MinimalEmployeeSerializer()
    host = MinimalEmployeeSerializer()
    type = CheckInTypeSerializer()

    class Meta:
        model = CheckIn
        fields = ('id', 'employee', 'host', 'date', 'summary', 'happiness', 'type', 'other_type_description')


class AddEditCheckInSerializer(serializers.ModelSerializer):
    host = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), required=False)
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    type = serializers.PrimaryKeyRelatedField(queryset=CheckInType.objects.all())
    happiness = serializers.PrimaryKeyRelatedField(queryset=Happiness.objects.all(), required=False)

    class Meta:
        model = CheckIn
        fields = ('id', 'host', 'employee', 'summary', 'happiness', 'date', 'type', 'other_type_description')

