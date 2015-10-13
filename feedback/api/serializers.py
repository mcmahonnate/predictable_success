from rest_framework import serializers
from org.models import Employee
from org.api.serializers import SanitizedEmployeeSerializer
from ..models import FeedbackRequest, FeedbackSubmission


class FeedbackRequestSerializer(serializers.ModelSerializer):
    request_date = serializers.DateTimeField(required=False)
    expiration_date = serializers.DateField(required=False)
    requester = SanitizedEmployeeSerializer()
    reviewer = SanitizedEmployeeSerializer()
    has_been_answered = serializers.BooleanField()

    class Meta:
        model = FeedbackRequest
        fields = ['id', 'request_date', 'expiration_date', 'requester', 'reviewer', 'message', 'has_been_answered']


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
            if feedback_request.is_complete:
                raise serializers.ValidationError("Cannot reply to a request that is already complete.")
            subject = data['subject']
            if feedback_request.requester != subject:
                raise serializers.ValidationError("Subject must be the same as requester.")
        return data

    class Meta:
        model = FeedbackSubmission
        fields = ['id', 'feedback_request', 'subject', 'excels_at', 'could_improve_on', 'anonymous']
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
            if feedback_request.is_complete:
                raise serializers.ValidationError("Request has already been completed.")
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
                  'excels_at', 'could_improve_on', 'unread',
                  'has_been_delivered', 'anonymous')


class CoacheeFeedbackReportSerializer(serializers.Serializer):
    coachee = SanitizedEmployeeSerializer()
    unanswered_requests = FeedbackRequestSerializer(many=True)
    solicited_submissions = FeedbackSubmissionSerializerForCoaches(many=True)
    unsolicited_submissions = FeedbackSubmissionSerializerForCoaches(many=True)
