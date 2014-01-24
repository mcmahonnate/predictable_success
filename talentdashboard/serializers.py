from rest_framework import serializers
from pvp.models import PvpEvaluation, EvaluationRound
from org.models import Employee, Team, Mentorship, Leadership, Attribute, AttributeCategory
from todo.models import Task
from comp.models import CompensationSummary
from blah.models import Comment
from django.contrib.auth.models import User

class TeamSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team
        fields = ('id', 'name', 'leader')

class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    team = TeamSerializer()
    avatar = serializers.SerializerMethodField('get_avatar_url')
    def get_avatar_url(self, obj):
        url = ''
        if obj.avatar:
            url = obj.avatar.url
        return url
    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'avatar', 'job_title', 'hire_date', 'team', 'display')

class MinimalEmployeeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'display', 'avatar')

class UserSerializer(serializers.ModelSerializer):
    employee = MinimalEmployeeSerializer()
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'employee')

class SubCommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = UserSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'object_id', 'created_date', 'modified_date')

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = UserSerializer()
    associated_object = MinimalEmployeeSerializer()
    class Meta:
        model = Comment
        fields = ('id', 'content', 'owner', 'object_id', 'created_date', 'modified_date', 'associated_object')

class TaskSerializer(serializers.HyperlinkedModelSerializer):
    created_by = MinimalEmployeeSerializer()
    assigned_to = MinimalEmployeeSerializer()
    employee = MinimalEmployeeSerializer()
    class Meta:
        model = Task
        fields = ('id', 'description', 'assigned_to', 'created_by', 'employee', 'created_date', 'due_date', 'completed')

class EvaluationRoundSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EvaluationRound
        fields = ['id', 'date',]

class PvpEvaluationSerializer(serializers.ModelSerializer):
    talent_category = serializers.IntegerField(source='get_talent_category')
    employee = EmployeeSerializer()
    evaluation_round = EvaluationRoundSerializer()

    class Meta:
        model = PvpEvaluation
        fields = ('potential', 'performance', 'talent_category', 'employee', 'evaluation_round')

class MentorshipSerializer(serializers.HyperlinkedModelSerializer):
    mentor = MinimalEmployeeSerializer()
    mentee = MinimalEmployeeSerializer()
    class Meta:
        model = Mentorship
        fields = ['mentor', 'mentee',]
        
class LeadershipSerializer(serializers.HyperlinkedModelSerializer):
    leader = MinimalEmployeeSerializer()
    employee = MinimalEmployeeSerializer()
    class Meta:
        model = Leadership
        fields = ['leader', 'employee',]

class AttributeCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AttributeCategory
        fields = ['id', 'name',]
        
class AttributeSerializer(serializers.HyperlinkedModelSerializer):
    employee = MinimalEmployeeSerializer()
    category = AttributeCategorySerializer()
    class Meta:
        model = Attribute
        fields = ['employee', 'name', 'category',]        
       
class TalentCategoryReportSerializer(serializers.Serializer):
    evaluation_date = serializers.DateField()
    categories = serializers.Field()
    total_evaluations = serializers.Field()

class SalaryReportSerializer(serializers.Serializer):
    categories = serializers.SerializerMethodField('get_categories')
    total_salaries = serializers.SerializerMethodField('get_total_salaries')

    def get_categories(self, obj):
        cats = {}
        for key in obj.categories:
            cats[key] = float(obj.categories[key])
        return cats

    def get_total_salaries(self, obj):
        return float(obj.total_salaries)

class CompensationSummarySerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer()
    total_compensation = serializers.SerializerMethodField('get_total_compensation')
    salary = serializers.SerializerMethodField('get_salary')
    bonus = serializers.SerializerMethodField('get_bonus')
    discretionary = serializers.SerializerMethodField('get_discretionary')
    writer_payments_and_royalties = serializers.SerializerMethodField('get_writer_payments_and_royalties')

    def get_salary(self, obj):
        return float(obj.salary)

    def get_bonus(self, obj):
        return float(obj.bonus)

    def get_discretionary(self, obj):
        return float(obj.discretionary)

    def get_writer_payments_and_royalties(self, obj):
        return float(obj.writer_payments_and_royalties)

    def get_total_compensation(self, obj):
        return float(obj.get_total_compensation())

    class Meta:
        model = CompensationSummary
        fields = ('year', 'fiscal_year', 'salary', 'bonus', 'discretionary', 'writer_payments_and_royalties', 'total_compensation',)
