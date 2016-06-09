from django.contrib.auth.models import User
from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from preferences.api.serializers import UserPreferencesSerializer
from ..models import Team, Employee, Leadership, Mentorship, Attribute, AttributeCategory


class TeamSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team
        fields = ('id', 'name', 'leader')


class SanitizedEmployeeSerializer(serializers.HyperlinkedModelSerializer):
    ''' Contains only information about an employee that can be displayed to any user.
    '''

    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'first_name', 'last_name', 'avatar', 'avatar_small')


class SanitizedEmployeeWithRelationshpsSerializer(serializers.HyperlinkedModelSerializer):
    ''' Contains only information about an employee that can be displayed to any user.
    '''
    coach = SanitizedEmployeeSerializer()
    leader = SanitizedEmployeeSerializer()

    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'first_name', 'last_name', 'avatar', 'avatar_small', 'coach', 'leader')


class MinimalEmployeeSerializer(serializers.HyperlinkedModelSerializer):
    avatar = serializers.SerializerMethodField()
    avatar_small = serializers.SerializerMethodField()
    current_talent_category = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        url = ''
        if obj.avatar:
            url = obj.avatar.url
        return url

    def get_avatar_small(self, obj):
        url = ''
        if obj.avatar_small:
            url = obj.avatar_small.url
        return url

    def get_current_talent_category(self, obj):
        return obj.current_talent_category()

    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'first_name', 'display', 'avatar', 'avatar_small', 'current_talent_category')


class EmployeeNameSerializer(serializers.HyperlinkedModelSerializer):
    avatar = serializers.SerializerMethodField()
    avatar_small = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        url = ''
        if obj.avatar:
            url = obj.avatar.url
        return url

    def get_avatar_small(self, obj):
        url = ''
        if obj.avatar_small:
            url = obj.avatar_small.url
        return url

    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'first_name', 'display', 'avatar', 'avatar_small')


class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    team = TeamSerializer()
    coach = MinimalEmployeeSerializer()
    leader = MinimalEmployeeSerializer()
    avatar = serializers.SerializerMethodField()
    avatar_small = serializers.SerializerMethodField()
    happiness_verbose  = serializers.SerializerMethodField()
    happiness = serializers.SerializerMethodField()
    happiness_date = serializers.SerializerMethodField()
    kolbe_fact_finder = serializers.SerializerMethodField()
    kolbe_follow_thru = serializers.SerializerMethodField()
    kolbe_quick_start = serializers.SerializerMethodField()
    kolbe_implementor = serializers.SerializerMethodField()
    vops_visionary = serializers.SerializerMethodField()
    vops_operator = serializers.SerializerMethodField()
    vops_processor = serializers.SerializerMethodField()
    vops_synergist = serializers.SerializerMethodField()
    current_salary = serializers.SerializerMethodField()
    current_bonus = serializers.SerializerMethodField()
    talent_category = serializers.SerializerMethodField()
    last_checkin_date = serializers.SerializerMethodField()


    def get_happiness_verbose(self, obj):
        if obj.current_happiness is None:
            return None
        return obj.current_happiness.assessment_verbose()

    def get_talent_category(self, obj):
         try:
            current_talent_category = obj.current_talent_category()
            return current_talent_category
         except:
             return None

    def get_current_salary(self, obj):
         try:
            current_salary = obj.comp.order_by('-pk')[0].salary
            return current_salary
         except:
             return None

    def get_current_bonus(self, obj):
        try:
            current_bonus = obj.comp.order_by('-pk')[0].bonus
            return current_bonus
        except:
            return None

    def get_happiness(self, obj):
        happiness = -1
        if obj.current_happiness:
            happiness = obj.current_happiness.assessment
        return happiness

    def get_happiness_date(self, obj):
        happiness_date = None
        if obj.current_happiness:
            happiness_date = obj.current_happiness.assessed_date
        return happiness_date

    def get_kolbe_fact_finder(self, obj):
        kolbe_fact_finder = None
        if obj.get_kolbe_fact_finder:
            kolbe_fact_finder = obj.get_kolbe_fact_finder
        return kolbe_fact_finder

    def get_kolbe_follow_thru(self, obj):
        kolbe_follow_thru = None
        if obj.get_kolbe_follow_thru:
            kolbe_follow_thru = obj.get_kolbe_follow_thru
        return kolbe_follow_thru

    def get_kolbe_quick_start(self, obj):
        kolbe_quick_start = None
        if obj.get_kolbe_quick_start:
            kolbe_quick_start = obj.get_kolbe_quick_start
        return kolbe_quick_start

    def get_kolbe_implementor(self, obj):
        kolbe_implementor = None
        if obj.get_kolbe_implementor:
            kolbe_implementor = obj.get_kolbe_implementor
        return kolbe_implementor

    def get_vops_visionary(self, obj):
        vops_visionary = None
        if obj.get_vops_visionary:
            vops_visionary = obj.get_vops_visionary
        return vops_visionary

    def get_vops_operator(self, obj):
        vops_operator = None
        if obj.get_vops_operator:
            vops_operator = obj.get_vops_operator
        return vops_operator

    def get_vops_processor(self, obj):
        vops_processor = None
        if obj.get_vops_processor:
            vops_processor = obj.get_vops_processor
        return vops_processor

    def get_vops_synergist(self, obj):
        vops_synergist = None
        if obj.get_vops_synergist:
            vops_synergist = obj.get_vops_synergist
        return vops_synergist

    def get_avatar(self, obj):
        url = ''
        if obj.avatar:
            url = obj.avatar.url
        return url

    def get_avatar_small(self, obj):
        url = ''
        if obj.avatar_small:
            url = obj.avatar_small.url
        return url

    def get_last_checkin_date(self, obj):
        try:
            return obj.checkins.latest().date
        except ObjectDoesNotExist:
            return None   


    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'first_name', 'last_name', 'gender', 'email', 'avatar', 'avatar_small', 'job_title', 'hire_date', 'leader', 'happiness', 'happiness_date', 'happiness_verbose', 'coach', 'kolbe_fact_finder','kolbe_follow_thru', 'kolbe_quick_start', 'kolbe_implementor', 'vops_visionary', 'vops_operator', 'vops_processor', 'vops_synergist', 'departure_date', 'team', 'display', 'current_salary', 'current_bonus', 'talent_category', 'last_checkin_date', 'is_lead', 'is_coach')


class SimpleUserSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'employee')
        read_only_fields = ('id', 'username', 'first_name', 'last_name', 'employee')


class UserSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    can_edit_employees = serializers.SerializerMethodField()
    can_view_comments = serializers.SerializerMethodField()
    can_coach_employees = serializers.SerializerMethodField()
    can_evaluate_employees = serializers.SerializerMethodField()
    can_view_company_dashboard = serializers.SerializerMethodField()
    can_view_projects = serializers.SerializerMethodField()
    is_team_lead = serializers.SerializerMethodField()
    preferences = UserPreferencesSerializer()
    permissions = serializers.SerializerMethodField()

    def get_permissions(self, obj):
        return obj.get_all_permissions()

    def get_can_edit_employees(self, obj):
        if obj.groups.filter(name='Edit Employee').exists() | obj.is_superuser:
                return True
        return False

    def get_can_view_projects(self, obj):
        if obj.has_perm('projects.add_project'):
                return True
        return False

    def get_can_view_comments(self, obj):
        if obj.groups.filter(name='View Comments').exists() | obj.is_superuser | obj.has_perm('org.view_employee_comments'):
                return True
        return False

    def get_can_evaluate_employees(self, obj):
        if obj.groups.filter(name='EvaluateAccess').exists() | obj.is_superuser:
                return True
        return False

    def get_can_coach_employees(self, obj):
        return obj.employee.is_coach()

    def get_can_view_company_dashboard(self, obj):
        if obj.groups.filter(name='AllAccess').exists() | obj.is_superuser:
                return True
        return False
    def get_is_team_lead(self, obj):
        if not obj.has_perm('org.view_employees_I_lead'):
            return False
        return obj.employee.is_lead()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'can_edit_employees', 'can_view_comments', 'can_coach_employees', 'can_evaluate_employees', 'can_view_company_dashboard', 'can_view_projects', 'is_team_lead', 'employee', 'last_login', 'preferences', 'permissions')


class MentorshipSerializer(serializers.HyperlinkedModelSerializer):
    mentor = SanitizedEmployeeSerializer()
    mentee = SanitizedEmployeeSerializer()

    class Meta:
        model = Mentorship
        fields = ['mentor', 'mentee',]


class LeadershipSerializer(serializers.HyperlinkedModelSerializer):
    leader = SanitizedEmployeeSerializer()
    employee = SanitizedEmployeeSerializer()

    class Meta:
        model = Leadership
        fields = ['leader', 'employee', 'start_date', 'end_date']


class AttributeCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AttributeCategory
        fields = ['id', 'name',]


class AttributeSerializer(serializers.HyperlinkedModelSerializer):
    employee = MinimalEmployeeSerializer()
    category = AttributeCategorySerializer()

    class Meta:
        model = Attribute
        fields = ['employee', 'name', 'category', 'display']

class CreateEmployeeSerializer(serializers.HyperlinkedModelSerializer):
    team = serializers.PrimaryKeyRelatedField(allow_null=True, required=False, queryset=Team.objects.all())
    coach = serializers.PrimaryKeyRelatedField(allow_null=True, required=False, queryset=Employee.objects.all())
    leader = serializers.PrimaryKeyRelatedField(allow_null=True, required=False, queryset=Employee.objects.all())

    class Meta:
        model = Employee
        fields = ('first_name', 'last_name', 'email', 'job_title', 'hire_date', 'team', 'display', 'coach', 'leader')

class EditEmployeeSerializer(serializers.HyperlinkedModelSerializer):
    team = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Team.objects.all())
    coach = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Employee.objects.all())
    leader = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Employee.objects.all())

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.job_title = validated_data.get('job_title', instance.job_title)
        instance.hire_date = validated_data.get('hire_date', instance.hire_date)
        instance.departure_date = validated_data.get('departure_date', instance.departure_date)
        instance.team = validated_data.get('team', instance.team)
        instance.display = validated_data.get('display', instance.display)
        instance.coach = validated_data.get('coach', instance.coach)
        instance.leader = validated_data.get('leader', instance.leader)
        instance.save()
        return instance

    class Meta:
        model = Employee
        fields = ('first_name', 'last_name', 'email', 'job_title', 'hire_date', 'departure_date', 'team', 'display', 'leader', 'coach')


class CoachChangeRequestSerializer(serializers.Serializer):
    new_coach = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())