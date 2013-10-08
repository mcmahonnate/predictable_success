from rest_framework import serializers
from pvp.models import PvpEvaluation, EvaluationRound
from org.models import Employee, Team

class TeamSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team
        fields = ('id', 'name')

class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    team = TeamSerializer()
    class Meta:
        model = Employee
        fields = ('id', 'informal_name', 'job_title', 'hire_date', 'team')

class EvaluationRoundSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EvaluationRound
        fields = ['id', 'date',]

class PvpEvaluationSerializer(serializers.ModelSerializer ):
    talent_category = serializers.IntegerField(source='get_talent_category')
    employee = EmployeeSerializer()
    evaluation_round = EvaluationRoundSerializer()

    class Meta:
        model = PvpEvaluation
        fields = ('potential', 'performance', 'talent_category', 'employee', 'evaluation_round')

