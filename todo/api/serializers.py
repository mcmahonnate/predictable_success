from rest_framework import serializers
from ..models import Task
from org.models import Employee
from org.api.serializers import SanitizedEmployeeSerializer
from checkins.models import CheckIn


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    created_by = SanitizedEmployeeSerializer()
    assigned_to = SanitizedEmployeeSerializer()
    assigned_by = SanitizedEmployeeSerializer()
    employee = SanitizedEmployeeSerializer()

    class Meta:
        model = Task
        fields = ('id', 'description', 'assigned_to', 'assigned_by', 'created_by', 'employee', 'created_date', 'due_date', 'completed')


class CreateTaskSerializer(serializers.HyperlinkedModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    assigned_to = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Employee.objects.all())
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    checkin = serializers.PrimaryKeyRelatedField(queryset=CheckIn.objects.all(), required=False)

    class Meta:
        model = Task
        fields = ('description', 'assigned_to', 'employee', 'due_date', 'created_by', 'checkin')


class EditTaskSerializer(serializers.HyperlinkedModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Employee.objects.all())
    assigned_by = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Employee.objects.all())

    def update(self, instance, validated_data):
            instance.description = validated_data.get('description', instance.description)
            instance.assigned_to = validated_data.get('assigned_to', instance.assigned_to)
            instance.assigned_by = validated_data.get('assigned_by', instance.assigned_by)
            instance.due_date = validated_data.get('due_date', instance.due_date)
            instance.completed = validated_data.get('completed', instance.completed)
            instance.save()
            return instance

    class Meta:
        model = Task
        fields = ('id', 'description', 'assigned_to', 'assigned_by', 'due_date', 'completed')


