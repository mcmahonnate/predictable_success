from blah.api.serializers import CommentSerializer
from rest_framework import serializers
from org.api.serializers import SanitizedEmployeeSerializer
from org.models import get_gravatar_image
from ..models import *


class AnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.SerializerMethodField()
    question_order = serializers.SerializerMethodField()

    def get_question_text(self, obj):
        return obj.question.text

    def get_question_order(self, obj):
        return obj.question.order

    class Meta:
        model = Answer
        fields = ('id', 'text', 'question_text', 'question_order')


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)
    answer = serializers.SerializerMethodField()

    def get_answer(self, obj):
        if obj.answer is None:
            return None
        serializer = AnswerSerializer(context=self.context)
        return serializer.to_representation(obj.answer)

    class Meta:
        model = Question
        fields = ('id', 'text', 'answers', 'answer', 'order')


class CreateEmployeeLeadershipStyleSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    assessor = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    request = serializers.PrimaryKeyRelatedField(queryset=LeadershipStyleRequest.objects.all(), required=False, allow_null=True)

    class Meta:
        model = EmployeeLeadershipStyle
        fields = ('id', 'employee', 'assessor', 'request', 'assessment_type')


class EmployeeLeadershipStyleReportSerializer(serializers.ModelSerializer):
    employee = SanitizedEmployeeSerializer()
    assessor = SanitizedEmployeeSerializer()
    date = serializers.SerializerMethodField()

    def get_date(self, obj):
        if obj.completed:
            return obj.date
        return None

    class Meta:
        model = EmployeeLeadershipStyle
        fields = ('id', 'employee', 'assessor', 'date', 'completed', 'times_retaken')


class ScoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Score
        fields = ('id', 'score', 'style', 'trait', 'style_verbose', 'trait_verbose')


class LeadershipStyleDescriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = LeadershipStyleDescription
        fields = ('id', 'style', 'style_verbose', 'description')


class EmployeeLeadershipStyleBaseSerializer(serializers.ModelSerializer):
    percentage_complete = serializers.SerializerMethodField()
    scores = ScoreSerializer(many=True)
    tease = serializers.SerializerMethodField()

    def get_percentage_complete(self, obj):
        question_count = Question.objects.filter(active=True, assessment_type=SELF).count()
        answer_count = obj.answers.all().count()
        print answer_count
        print question_count
        if answer_count == 0:
            return 0
        else:
            p = (float(answer_count)/float(question_count)) * 100
            p = round(p)
            return int(p)

    def get_tease(self, obj):
        if not obj.completed:
            return None
        dominant = obj.scores.order_by('-score').first()
        description = LeadershipStyleDescription.objects.get(style=dominant.style)
        serializer = LeadershipStyleDescriptionSerializer(context=self.context)
        return serializer.to_representation(description)

    class Meta:
        model = EmployeeLeadershipStyle
        fields = ('id', 'date', 'percentage_complete', 'completed', 'scores', 'tease')


class EmployeeLeadershipStyleSerializer(EmployeeLeadershipStyleBaseSerializer):
    employee = SanitizedEmployeeSerializer()
    assessor = SanitizedEmployeeSerializer()
    next_question = serializers.SerializerMethodField()
    answers = serializers.SerializerMethodField()

    def get_next_question(self, obj):
        next_question = obj.next_question()
        if next_question is None:
            return None
        for answer in obj.answers.all():
            if next_question.id == answer.question.id:
                next_question.answer = answer
        serializer = QuestionSerializer(context=self.context)
        return serializer.to_representation(next_question)

    def get_answers(self, obj):
        if obj.completed:
            serializer = AnswerSerializer(context=self.context, many=True)
            return serializer.to_representation(obj.answers)
        else:
            return [answer.id for answer in obj.answers.all()]

    class Meta:
        model = EmployeeLeadershipStyle
        fields = ('id', 'assessment_type', 'active', 'employee', 'assessor', 'next_question', 'notes', 'answers', 'date',
                  'total_questions', 'total_answered', 'completed', 'times_retaken', 'is_draft', 'scores', 'tease')


class UpdateEmployeeLeadershipStyleSerializer(serializers.ModelSerializer):
    assessor = serializers.PrimaryKeyRelatedField(required=False, queryset=Employee.objects.all(), allow_null=False)
    last_question_answered = serializers.PrimaryKeyRelatedField(required=False, queryset=Question.objects.all(), allow_null=True)
    answers = serializers.PrimaryKeyRelatedField(required=False, queryset=Answer.objects.all(), many=True, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    completed = serializers.BooleanField(required=False)
    date = serializers.DateTimeField(required=False)

    class Meta:
        model = EmployeeLeadershipStyle
        fields = ('id', 'assessor', 'last_question_answered', 'answers', 'notes', 'completed', 'date', 'is_draft')


class RequestSerializer(serializers.ModelSerializer):
    request_date = serializers.DateTimeField(required=False)
    expiration_date = serializers.DateField(required=False)
    requester = SanitizedEmployeeSerializer()
    reviewer = SanitizedEmployeeSerializer()
    submission_id = serializers.SerializerMethodField()

    def get_submission_id(self, obj):
        try:
            submission = obj.submission.get()
            return submission.id
        except EmployeeLeadershipStyle.DoesNotExist:
            return None

    class Meta:
        model = LeadershipStyleRequest
        fields = ['id', 'request_date', 'expiration_date', 'requester', 'reviewer', 'submission_id', 'message', 'was_responded_to', 'was_declined']


class CreateRequestSerializer(serializers.ModelSerializer):
    reviewer = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), required=False)
    reviewer_email = serializers.CharField(required=False, allow_blank=True)
    message = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = LeadershipStyleRequest
        fields = ['reviewer', 'reviewer_email', 'message']


class TeamMemberSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    leadership_style = EmployeeLeadershipStyleBaseSerializer()

    def get_avatar(self, obj):
        avatar_field = Employee._meta.get_field('avatar')
        if avatar_field.default == obj.avatar:
            tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
            default_url = tenant.build_url(avatar_field.default)
            gravatar = get_gravatar_image(email=obj.email, default=default_url)
            return gravatar

    class Meta:
        model = Employee
        fields = ['id', 'full_name', 'first_name', 'last_name', 'email', 'avatar', 'leadership_style']


class TeamLeadershipStyleSerializer(serializers.ModelSerializer):
    owner = SanitizedEmployeeSerializer()
    team_members = TeamMemberSerializer(many=True)

    class Meta:
        model = TeamLeadershipStyle
        fields = ['id', 'owner', 'team_members']

