from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.fields import IntegerField
from django.core.exceptions import ObjectDoesNotExist
from preferences.api.serializers import UserPreferencesSerializer
from ..models import *


class TeamSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team
        fields = ('id', 'name', 'leader')


class BaseEmployeeSerializer(serializers.HyperlinkedModelSerializer):
    can_view_talent_category = False
    requester_has_access = serializers.SerializerMethodField()

    def get_requester_has_access(self, obj):
        if 'request' in self.context:
            if obj.is_viewable_by_user(self.context['request'].user):
                self.can_view_talent_category = True
                return True
        return False


class SanitizedEmployeeSerializer(BaseEmployeeSerializer):
    ''' Contains only information about an employee that can be displayed to any user.
    '''
    avatar = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        avatar_field = Employee._meta.get_field('avatar')
        if avatar_field.default == obj.avatar:
            gravatar = get_gravatar_image(email=obj.email)
            return gravatar

    def get_team(self, object):
        if object.team is None:
            return None
        return object.team.name

    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'first_name', 'last_name', 'avatar', 'avatar_small', 'requester_has_access', 'team', 'hire_date', 'gender')


class BlacklistedEmployeeSerializer(SanitizedEmployeeSerializer):
    def __init__(self, *args, **kwargs):
        super(BlacklistedEmployeeSerializer, self).__init__(*args, **kwargs)
        self.fields['blacklisted_by_count'] = IntegerField(read_only=True)


class SanitizedEmployeeWithRelationshpsSerializer(BaseEmployeeSerializer):
    ''' Contains only information about an employee that can be displayed to any user.
    '''
    coach = SanitizedEmployeeSerializer()
    leader = SanitizedEmployeeSerializer()

    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'first_name', 'last_name', 'avatar', 'avatar_small', 'requester_has_access', 'coach', 'leader')


class MinimalEmployeeSerializer(BaseEmployeeSerializer):
    avatar = serializers.SerializerMethodField()
    avatar_small = serializers.SerializerMethodField()
    talent_category = serializers.SerializerMethodField()
    happiness_verbose = serializers.SerializerMethodField()
    happiness = serializers.SerializerMethodField()
    happiness_date = serializers.SerializerMethodField()
    last_checkin_date = serializers.SerializerMethodField()

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

    def get_talent_category(self, obj):
        if self.can_view_talent_category:
            return obj.current_talent_category()
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

    def get_happiness_verbose(self, obj):
        if obj.current_happiness is None:
            return None
        return obj.current_happiness.assessment_verbose()

    def get_last_checkin_date(self, obj):
        try:
            return obj.checkins.latest().date
        except ObjectDoesNotExist:
            return None

    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'first_name', 'display', 'avatar', 'avatar_small', 'happiness', 'happiness_date', 'happiness_verbose', 'last_checkin_date', 'requester_has_access', 'talent_category', 'requester_has_access')


class EmployeeNameSerializer(BaseEmployeeSerializer):
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
        fields = ('id', 'full_name', 'first_name', 'display', 'avatar', 'avatar_small', 'requester_has_access')


class EmployeeSerializer(BaseEmployeeSerializer):
    team = TeamSerializer()
    coach = serializers.SerializerMethodField()
    leader = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    avatar_small = serializers.SerializerMethodField()
    happiness_verbose = serializers.SerializerMethodField()
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
    requester_has_access_to_team = serializers.SerializerMethodField()
    requester_has_access_to_coachees = serializers.SerializerMethodField()

    def get_requester_has_access_to_team(self, obj):
        user = self.context['request'].user
        if user.employee.is_ancestor_of(other=obj, include_self=True) or \
                user.employee.can_view_all_employees:
            return True
        return False

    def get_requester_has_access_to_coachees(self, obj):
        user = self.context['request'].user
        if obj.id == user.employee.id or \
                user.employee.can_view_all_employees:
            return True
        return False

    def get_coach(self, obj):
        serializer = MinimalEmployeeSerializer(context=self.context)
        return serializer.to_representation(obj.coach)

    def get_leader(self, obj):
        if obj.leader:
            serializer = MinimalEmployeeSerializer(context=self.context)
            return serializer.to_representation(obj.leader)
        return None

    def get_happiness_verbose(self, obj):
        if obj.current_happiness is None:
            return None
        return obj.current_happiness.assessment_verbose()

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


    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'first_name', 'last_name', 'gender', 'email', 'avatar', 'avatar_small', 'requester_has_access', 'requester_has_access_to_team', 'requester_has_access_to_coachees', 'job_title', 'hire_date', 'leader', 'happiness', 'happiness_date', 'happiness_verbose', 'coach', 'kolbe_fact_finder','kolbe_follow_thru', 'kolbe_quick_start', 'kolbe_implementor', 'vops_visionary', 'vops_operator', 'vops_processor', 'vops_synergist', 'departure_date', 'team', 'display', 'current_salary', 'current_bonus', 'is_lead', 'is_coach')


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
    team = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Team.objects.all(), required=False)
    coach = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Employee.objects.all(), required=False)
    leader = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Employee.objects.all(), required=False)

    def update(self, instance, validated_data):
        instance.full_name = validated_data.get('full_name', instance.full_name)
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
        fields = ('full_name', 'first_name', 'last_name', 'email', 'job_title', 'hire_date', 'departure_date', 'team', 'display', 'leader', 'coach')


class CoachChangeRequestSerializer(serializers.Serializer):
    new_coach = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())


class CoachProfileSerializer(serializers.HyperlinkedModelSerializer):
    employee = SanitizedEmployeeSerializer()
    blacklist = serializers.SerializerMethodField()

    def get_blacklist(self, obj):
        if obj.blacklisted_employees_that_are_still_employeed:
            serializer = SanitizedEmployeeSerializer(many=True, context=self.context)
            return serializer.to_representation(obj.blacklisted_employees_that_are_still_employeed)
        return None

    class Meta:
        model = CoachProfile
        fields = ['id', 'employee', 'max_allowed_coachees', 'blacklist', 'approach']


class PublicCoachProfileSerializer(CoachProfileSerializer):
    def __init__(self, *args, **kwargs):
        super(CoachProfileSerializer, self).__init__(*args, **kwargs)
        self.fields.pop("blacklist")
        self.fields.pop("max_allowed_coachees")


class CreateUpdateCoachProfileSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    max_allowed_coachees = serializers.IntegerField()
    blacklist = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), many=True)
    approach = serializers.CharField()

    class Meta:
        model = CoachProfile
        fields = ('id', 'employee', 'max_allowed_coachees', 'blacklist', 'approach')


class CoachSerializer(BaseEmployeeSerializer):
    coachees = SanitizedEmployeeSerializer(many=True)
    coaching_profile = serializers.SerializerMethodField()

    def get_coaching_profile(self, obj):
        try:
            profile = obj.coaching_profile.get()
            serializer = CoachProfileSerializer(context=self.context)
            return serializer.to_representation(profile)
        except CoachProfile.DoesNotExsist:
            return None

    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'first_name', 'last_name', 'avatar', 'avatar_small', 'requester_has_access', 'coachees', 'coaching_profile')


class CoachReportSerializer(serializers.ModelSerializer):
    number_of_coachees = serializers.SerializerMethodField()
    capacity = serializers.SerializerMethodField()
    filled_out_approach = serializers.SerializerMethodField()
    number_blacklisted = serializers.SerializerMethodField()
    max_allowed_coachees = serializers.SerializerMethodField()

    def get_coaching_profile(self, obj):
        return obj.coaching_profile.get()

    def get_number_of_coachees(self, obj):
        return obj.coachees.filter(departure_date__isnull=True).count()

    def get_number_blacklisted(self, obj):
        profile = self.get_coaching_profile(obj)
        if profile:
            return profile.blacklist.filter(departure_date__isnull=True).count()
        return None

    def get_filled_out_approach(self, obj):
        profile = self.get_coaching_profile(obj)
        if profile:
            return not(profile.approach == '')
        return None

    def get_max_allowed_coachees(self, obj):
        profile = self.get_coaching_profile(obj)
        if profile:
            return profile.max_allowed_coachees
        return 0

    def get_capacity(self, obj):
        max_allowed_coachees = self.get_max_allowed_coachees(obj)
        number_of_coachees = self.get_number_of_coachees(obj)
        return max_allowed_coachees - number_of_coachees


    def get_coaching_profile(self, obj):
        try:
            return obj.coaching_profile.get()
        except CoachProfile.DoesNotExsist:
            return None

    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'avatar', 'max_allowed_coachees', 'number_of_coachees', 'capacity', 'filled_out_approach', 'number_blacklisted')