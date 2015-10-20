from rest_framework import serializers
from org.models import Employee
from org.api.serializers import SanitizedEmployeeSerializer
from ..models import FeedbackRequest, FeedbackSubmission, FeedbackDigest


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


class FeedbackSubmissionSerializerForCoaches(serializers.ModelSerializer):
    feedback_date = serializers.DateTimeField(required=False)
    subject = SanitizedEmployeeSerializer()
    reviewer = SanitizedEmployeeSerializer()

    class Meta:
        model = FeedbackSubmission
        fields = ('id', 'feedback_date', 'subject', 'reviewer',
                  'excels_at', 'could_improve_on', 'excels_at_summarized',
                  'could_improve_on_summarized', 'unread',
                  'has_been_delivered', 'anonymous')


class FeedbackProgressReportSerializer(serializers.Serializer):
    employee = SanitizedEmployeeSerializer()
    unanswered_requests = FeedbackRequestSerializer(many=True)
    solicited_submissions = FeedbackSubmissionSerializerForCoaches(many=True)
    unsolicited_submissions = FeedbackSubmissionSerializerForCoaches(many=True)


class FeedbackDigestSerializerForCoach(serializers.ModelSerializer):
    subject = SanitizedEmployeeSerializer()
    delivered_by = SanitizedEmployeeSerializer()
    submissions = FeedbackSubmissionSerializerForCoaches(many=True)

    class Meta:
        model = FeedbackDigest


class AddSubmissionToDigestSerializer(serializers.Serializer):
    submission = serializers.PrimaryKeyRelatedField(queryset=FeedbackSubmission.objects.all())
