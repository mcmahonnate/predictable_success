from rest_framework import serializers
from ..models import PvpEvaluation, EvaluationRound, PvpDescription
from org.models import Employee
from org.api.serializers import EmployeeSerializer, UserSerializer, TeamSerializer
from blah.api.serializers import EmployeeCommentSerializer


class PvPEmployeeSerializer(serializers.HyperlinkedModelSerializer):
    team = TeamSerializer()
    avatar = serializers.SerializerMethodField()
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
    current_talent_category = serializers.SerializerMethodField()

    def get_current_talent_category(self, obj):
        current_talent_category = None
        if obj.current_talent_category:
            current_talent_category = obj.current_talent_category()
        return current_talent_category

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

    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'first_name', 'last_name', 'avatar', 'happiness', 'happiness_date', 'kolbe_fact_finder','kolbe_follow_thru', 'kolbe_quick_start', 'kolbe_implementor', 'vops_visionary', 'vops_operator', 'vops_processor', 'vops_synergist', 'team', 'display', 'current_talent_category', 'email')


class EvaluationRoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationRound
        fields = ['id', 'date',]


class PvpDescriptionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PvpDescription
        fields = ['performance', 'potential', 'description']


class PvpEvaluationSerializer(serializers.ModelSerializer):
    talent_category = serializers.IntegerField()
    employee = EmployeeSerializer()
    evaluation_round = EvaluationRoundSerializer()
    evaluator = UserSerializer()
    comment = EmployeeCommentSerializer()

    class Meta:
        model = PvpEvaluation
        fields = ('id', 'potential', 'performance', 'talent_category', 'employee', 'evaluation_round', 'evaluator', 'comment')


class PvpEvaluationEditSerializer(serializers.ModelSerializer):
    comment = EmployeeCommentSerializer()

    class Meta:
        model = PvpEvaluation
        fields = ('id', 'potential', 'performance', 'comment')


class MinimalPvpEvaluationSerializer(serializers.ModelSerializer):
    talent_category = serializers.IntegerField()
    employee = PvPEmployeeSerializer()

    class Meta:
        model = PvpEvaluation
        fields = ('id', 'talent_category', 'employee')


class PvpToDoSerializer(serializers.ModelSerializer):
    talent_category = serializers.IntegerField()
    employee = PvPEmployeeSerializer()
    evaluator = UserSerializer()
    comment = EmployeeCommentSerializer()
    description = PvpDescriptionSerializer(source='get_description', many=False)

    class Meta:
        model = PvpEvaluation
        fields = ('id', 'talent_category', 'employee', 'potential', 'performance', 'evaluator', 'comment', 'description', 'too_new', 'is_complete')


class TalentCategoryReportSerializer(serializers.Serializer):
    evaluation_date = serializers.DateField()
    categories = serializers.DictField()
    total_evaluations = serializers.IntegerField()