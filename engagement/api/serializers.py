from rest_framework import serializers
from talentdashboard.views.serializers import MinimalEmployeeSerializer
from org.models import Employee
from checkins.models import CheckIn
from ..models import Happiness


class HappinessSerializer(serializers.ModelSerializer):
    assessed_by = MinimalEmployeeSerializer()
    employee = MinimalEmployeeSerializer()

    class Meta:
        model = Happiness
        fields = ('id', 'assessed_by', 'employee', 'assessed_date', 'assessment', 'comment')


class AddEditHappinessSerializer(serializers.ModelSerializer):
    assessed_by = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), required=False)
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())

    class Meta:
        model = Happiness
        fields = ('id', 'assessed_by', 'employee', 'assessed_date', 'assessment', 'comment')

