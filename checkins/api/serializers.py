from rest_framework import serializers
from talentdashboard.views.serializers import MinimalEmployeeSerializer
from org.models import Employee
from ..models import CheckIn


class CheckInSerializer(serializers.HyperlinkedModelSerializer):
    employee = MinimalEmployeeSerializer()
    host = MinimalEmployeeSerializer()

    class Meta:
        model = CheckIn
        fields = ('employee', 'host', 'date', 'summary', 'happiness')


class CreateCheckInSerializer(serializers.HyperlinkedModelSerializer):
    host = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())

    class Meta:
        model = CheckIn
        fields = ('employee', 'summary', 'happiness')

