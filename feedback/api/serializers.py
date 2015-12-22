from rest_framework import serializers
from org.models import Employee
from org.api.serializers import SanitizedEmployeeSerializer, MinimalEmployeeSerializer
from ..models import FeedbackRequest, FeedbackSubmission, FeedbackDigest, FeedbackHelpful


class FeedbackRequestSerializer(serializers.ModelSerializer):
    request_date = serializers.DateTimeField(required=False)
    expiration_date = serializers.DateField(required=False)
    requester = SanitizedEmployeeSerializer()
    reviewer = SanitizedEmployeeSerializer()

    class Meta:
        model = FeedbackRequest
        fields = ['id', 'request_date', 'expiration_date', 'requester', 'reviewer', 'message', 'has_been_answered', 'was_declined']


class CreateFeedbackRequestSerializer(serializers.ModelSerializer):
    reviewer = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    message = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = FeedbackRequest
        fields = ['reviewer', 'message']


class CreateFeedbackSubmissionSerializer(serializers.ModelSerializer):
    feedback_request = serializers.PrimaryKeyRelatedField(queryset=FeedbackRequest.objects.all(), required=False)
    subject = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())

    def validate(self, data):
        feedback_request = data.get('feedback_request', None)
        if feedback_request is not None:
            if feedback_request.was_responded_to:
                raise serializers.ValidationError("Cannot reply to a request that has already been responded to.")
            subject = data['subject']
            if feedback_request.requester != subject:
                raise serializers.ValidationError("Subject must be the same as requester.")
        return data

    class Meta:
        model = FeedbackSubmission
        fields = ['id', 'feedback_request', 'subject', 'excels_at', 'could_improve_on', 'anonymous']
        read_only_fields = ['id',]


class CoachEditFeedbackSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackSubmission
        fields = ['id', 'excels_at_summarized', 'could_improve_on_summarized',]
        read_only_fields = ['id',]


class FeedbackHelpfulSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackHelpful
        fields = ('id', 'helpfulness', 'reason', 'date')


class EmployeeEditFeedbackSubmissionSerializer(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        if validated_data['excels_at_helpful']:
            print validated_data['excels_at_helpful']
            if instance.excels_at_helpful is None:
                print 'else'
                excels_at_helpful = FeedbackHelpful.objects.create(**validated_data['excels_at_helpful'])
                instance.excels_at_helpful = excels_at_helpful
            else:
                print validated_data['excels_at_helpful']['helpfulness']
                instance.excels_at_helpful.helpfulness = validated_data['excels_at_helpful']['helpfulness']
                instance.excels_at_helpful.reason = validated_data['excels_at_helpful']['reason']
                instance.excels_at_helpful.save()
            instance.save()
        if validated_data['could_improve_on_helpful']:
            if instance.could_improve_on is None:
                could_improve_on_helpful = FeedbackHelpful.objects.create(**validated_data['could_improve_on_helpful'])
                instance.could_improve_on_helpful = could_improve_on_helpful
            else:
                instance.could_improve_on_helpful.helpfulness = validated_data['could_improve_on_helpful']['helpfulness']
                instance.could_improve_on_helpful.reason = validated_data['could_improve_on_helpful']['reason']
                instance.could_improve_on_helpful.save()
            instance.save()
        return instance

    excels_at_helpful = FeedbackHelpfulSerializer(required=False, allow_null=True)
    could_improve_on_helpful = FeedbackHelpfulSerializer(required=False, allow_null=True)
    class Meta:
        model = FeedbackSubmission
        fields = ['id', 'excels_at_helpful', 'could_improve_on_helpful',]
        read_only_fields = ['id',]


class WriteableFeedbackSubmissionSerializer(serializers.ModelSerializer):
    feedback_date = serializers.DateTimeField(required=False)
    subject = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    reviewer = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    feedback_request = serializers.PrimaryKeyRelatedField(required=False, queryset=FeedbackRequest.objects.all())

    def validate(self, attrs):
        if 'feedback_request' in attrs:
            feedback_request = attrs['feedback_request']
            subject = attrs['subject']
            reviewer = attrs['reviewer']
            if feedback_request.was_responded_to:
                raise serializers.ValidationError("Request has already been responded to.")
            if feedback_request.requester != subject:
                raise serializers.ValidationError("Subject is not the same as the feedback requester.")
            if feedback_request.reviewer != reviewer:
                raise serializers.ValidationError("Reviewer is not the same as requested by the subject.")
        return attrs

    class Meta:
        model = FeedbackSubmission


class FeedbackSubmissionSerializerForReviewer(serializers.ModelSerializer):
    feedback_date = serializers.DateTimeField(required=False)
    subject = SanitizedEmployeeSerializer()
    reviewer = SanitizedEmployeeSerializer()
    excels_at_helpful = FeedbackHelpfulSerializer()
    could_improve_on_helpful = FeedbackHelpfulSerializer()

    class Meta:
        model = FeedbackSubmission
        fields = ('id', 'feedback_date', 'subject', 'reviewer',
                  'excels_at', 'could_improve_on', 'unread',
                  'has_been_delivered', 'anonymous', 'excels_at_helpful', 'could_improve_on_helpful')


class FeedbackSubmissionSerializerForCoaches(serializers.ModelSerializer):
    feedback_date = serializers.DateTimeField(required=False)
    subject = SanitizedEmployeeSerializer()
    reviewer = SanitizedEmployeeSerializer()
    has_digest = serializers.SerializerMethodField()
    was_requested = serializers.SerializerMethodField()
    message = serializers.SerializerMethodField()
    excels_at_helpful = FeedbackHelpfulSerializer()
    could_improve_on_helpful = FeedbackHelpfulSerializer()

    def get_message(self, submission):
        if submission.feedback_request:
            return submission.feedback_request.message
        else:
            return None

    def get_has_digest(self, submission):
        if submission.feedback_digest:
            return True
        else:
            return False

    def get_was_requested(self, submission):
        if submission.feedback_request:
            return True
        else:
            return False

    class Meta:
        model = FeedbackSubmission
        fields = ('id', 'feedback_date', 'subject', 'reviewer',
                  'excels_at', 'could_improve_on', 'excels_at_summarized',
                  'could_improve_on_summarized', 'unread',
                  'has_been_delivered', 'anonymous', 'has_digest',
                  'was_requested', 'message', 'excels_at_helpful', 'could_improve_on_helpful')


class FeedbackSubmissionSerializerForEmployee(serializers.ModelSerializer):
    feedback_date = serializers.DateTimeField(required=False)
    subject = SanitizedEmployeeSerializer()
    reviewer = SanitizedEmployeeSerializer(source='anonymized_reviewer')
    excels_at = serializers.SerializerMethodField()
    could_improve_on = serializers.SerializerMethodField()
    excels_at_helpful = FeedbackHelpfulSerializer()
    could_improve_on_helpful = FeedbackHelpfulSerializer()

    def get_could_improve_on(self, submission):
        return submission.could_improve_on_summarized if submission.could_improve_on_summarized else submission.could_improve_on

    def get_excels_at(self, submission):
        return submission.excels_at_summarized if submission.excels_at_summarized else submission.excels_at

    class Meta:
        model = FeedbackSubmission
        fields = ('id', 'feedback_date', 'subject', 'reviewer',
                  'excels_at', 'could_improve_on', 'unread',
                  'has_been_delivered', 'anonymous', 'excels_at_helpful', 'could_improve_on_helpful')


class EmployeeFeedbackReportSerializer(serializers.Serializer):
    employee = MinimalEmployeeSerializer()
    total_i_requested = serializers.IntegerField()
    total_requested_of_me = serializers.IntegerField()
    total_i_responded_to = serializers.IntegerField()
    total_responded_to_me = serializers.IntegerField()
    total_unrequested_i_gave = serializers.IntegerField()
    total_unrequested_given_to_me = serializers.IntegerField()
    total_digests_i_received = serializers.IntegerField()
    total_digests_i_delivered = serializers.IntegerField()
    total_excels_at_i_gave_that_was_helpful = serializers.IntegerField()
    total_could_improve_i_gave_that_was_helpful = serializers.IntegerField()
    total_i_gave_that_was_helpful = serializers.IntegerField()


class EmployeeFeedbackReportsSerializer(serializers.Serializer):
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    total_i_requested_total = serializers.IntegerField()
    total_requested_of_me_total = serializers.IntegerField()
    total_i_responded_to_total = serializers.IntegerField()
    total_responded_to_me_total = serializers.IntegerField()
    total_unrequested_i_gave_total = serializers.IntegerField()
    total_unrequested_given_to_me_total = serializers.IntegerField()
    total_digests_i_received_total = serializers.IntegerField()
    total_digests_i_delivered_total = serializers.IntegerField()
    total_excels_at_i_gave_that_was_helpful = serializers.IntegerField()
    total_could_improve_i_gave_that_was_helpful = serializers.IntegerField()
    total_i_gave_that_was_helpful = serializers.IntegerField()

    employee_report = EmployeeFeedbackReportSerializer(many=True)


class EmployeeSubmissionReportSerializer(serializers.Serializer):
    total_excels_at_i_gave = serializers.IntegerField()
    total_could_improve_i_gave = serializers.IntegerField()
    total_i_gave = serializers.IntegerField()
    total_excels_at_i_gave_that_was_helpful = serializers.IntegerField()
    total_could_improve_i_gave_that_was_helpful = serializers.IntegerField()
    total_i_gave_that_was_helpful = serializers.IntegerField()
    total_percent_helpful = serializers.IntegerField()


class FeedbackProgressReportSerializer(serializers.Serializer):
    employee = SanitizedEmployeeSerializer()
    unanswered_requests = FeedbackRequestSerializer(many=True)
    all_submissions_not_delivered_and_not_in_digest = FeedbackSubmissionSerializerForCoaches(many=True)


class FeedbackProgressReportCountsSerializer(serializers.Serializer):
    employee = SanitizedEmployeeSerializer()
    unanswered_requests_count = serializers.SerializerMethodField()
    solicited_submissions_count = serializers.SerializerMethodField()
    unsolicited_submissions_count = serializers.SerializerMethodField()
    total_submissions_count = serializers.SerializerMethodField()
    recent_feedback_requests_ive_sent_count = serializers.SerializerMethodField()

    def get_unanswered_requests_count(self, obj):
        return int(obj.unanswered_requests.count())

    def get_solicited_submissions_count(self, obj):
        return int(obj.solicited_submissions.count())

    def get_unsolicited_submissions_count(self, obj):
        return int(obj.unsolicited_submissions.count())

    def get_recent_feedback_requests_ive_sent_count(self, obj):
        return int(obj.recent_feedback_requests_ive_sent.count())

    def get_total_submissions_count(self, obj):
        return int(obj.all_submissions_not_delivered.count())


class FeedbackDigestSerializerForEmployee(serializers.ModelSerializer):
    subject = SanitizedEmployeeSerializer()
    delivered_by = SanitizedEmployeeSerializer()
    submissions = FeedbackSubmissionSerializerForEmployee(many=True)

    class Meta:
        model = FeedbackDigest


class FeedbackDigestSerializerForCoaches(serializers.ModelSerializer):
    subject = SanitizedEmployeeSerializer()
    delivered_by = SanitizedEmployeeSerializer()
    submissions = FeedbackSubmissionSerializerForCoaches(many=True)

    class Meta:
        model = FeedbackDigest


class SummarizedFeedbackDigestSerializer(serializers.ModelSerializer):
    subject = SanitizedEmployeeSerializer()
    delivered_by = SanitizedEmployeeSerializer()

    class Meta:
        model = FeedbackDigest
        fields = ('id', 'subject', 'delivered_by', 'delivery_date')


class AddRemoveSubmissionToDigestSerializer(serializers.Serializer):
    submission = serializers.PrimaryKeyRelatedField(queryset=FeedbackSubmission.objects.all())

    class Meta:
        model = FeedbackDigest
        fields = ('submission',)


class EditFeedbackDigestSerializer(serializers.Serializer):
    summary = serializers.CharField(required=False, allow_blank=True)
    has_been_delivered = serializers.BooleanField(required=False)
