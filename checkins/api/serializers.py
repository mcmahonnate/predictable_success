from rest_framework import serializers
from talentdashboard.views.serializers import MinimalEmployeeSerializer
from org.models import Employee
from ..models import CheckIn, CheckInType


class CheckInSerializer(serializers.HyperlinkedModelSerializer):
    employee = MinimalEmployeeSerializer()
    host = MinimalEmployeeSerializer()

    class Meta:
        model = CheckIn
        fields = ('employee', 'host', 'date', 'summary', 'happiness')


class AddEditCheckInSerializer(serializers.HyperlinkedModelSerializer):
    host = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), required=False)
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    type = serializers.PrimaryKeyRelatedField(queryset=CheckInType.objects.all())

    class Meta:
        model = CheckIn
        fields = ('host', 'employee', 'summary', 'happiness', 'date', 'type', 'other_type_description')

