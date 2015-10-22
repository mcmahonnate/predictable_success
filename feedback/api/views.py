from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import *
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from serializers import *
from org.models import Employee
from org.api.permissions import UserIsEmployeesCoach, UserIsEmployeeOrCoachOfEmployee
from ..models import FeedbackRequest, FeedbackProgressReport, FeedbackDigest


# FeedbackRequest
class CreateFeedbackRequest(CreateAPIView):
    serializer_class = CreateFeedbackRequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        kwargs['many'] = isinstance(self.request.DATA, list)
        return serializer_class(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user.employee)


class RecentFeedbackRequestsIveSentList(ListAPIView):
    serializer_class = FeedbackRequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return FeedbackRequest.objects.recent_feedback_requests_ive_sent(requester=self.request.user.employee)


class RetrieveFeedbackRequest(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FeedbackRequestSerializer
    queryset = FeedbackRequest.objects.all()


# FeedbackSubmission
class CreateFeedbackSubmission(CreateAPIView):
    serializer_class = CreateFeedbackSubmissionSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user.employee)


class RetrieveFeedbackSubmission(RetrieveAPIView):
    permission_classes = (IsAuthenticated, UserIsEmployeeOrCoachOfEmployee,)
    queryset = FeedbackSubmission.objects.all()

    def get_employee(self):
        submission = self.get_object()
        return submission.subject

    def get_serializer_class(self):
        employee_making_the_request = self.request.user.employee
        submission = self.get_object()
        if employee_making_the_request == submission.subject.coach:
            return FeedbackSubmissionSerializerForCoaches
        if employee_making_the_request == submission.subject:
            return FeedbackSubmissionSerializerForEmployee
        raise Exception("Can't determine which serializer class to use")


# Miscellaneous
class PotentialReviewers(ListAPIView):
    serializer_class = SanitizedEmployeeSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Return all Employees, excluding the current user as well
        as anyone that they have pending requests for.
        """
        requester = self.request.user.employee
        current_requests = FeedbackRequest.objects.unanswered_for_requester(requester)
        employees_to_exclude = [feedback_request.reviewer for feedback_request in current_requests]
        requester = Employee.objects.get_from_user(self.request.user)
        employees_to_exclude.append(requester)
        ids_to_exclude = [e.id for e in employees_to_exclude]
        return Employee.objects.exclude(id__in=ids_to_exclude)


class FeedbackRequestsToDoList(ListAPIView):
    serializer_class = FeedbackRequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Return all FeedbackRequests sent to the user that haven't been completed.
        """
        return FeedbackRequest.objects.pending_for_reviewer(self.request.user.employee)


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def feedback_progress_report(request, pk):
    try:
        employee = Employee.objects.get(pk=pk)
        if not request.user.employee == employee.coach:
            raise PermissionDenied
        report = FeedbackProgressReport(employee)
        report.load()
        serializer = FeedbackProgressReportSerializer(report)
        return Response(serializer.data)
    except Employee.DoesNotExist:
        raise Http404()


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def get_current_digest(request, employee_id):
    try:
        employee = Employee.objects.get(pk=employee_id)
        if not request.user.employee == employee.coach:
            raise PermissionDenied
        digest = FeedbackDigest.objects.get(subject=employee, has_been_delivered=False)
        serializer = FeedbackDigestSerializerForCoach(digest)
        return Response(serializer.data)
    except Employee.DoesNotExist:
        raise Http404()


class CoachUpdateFeedbackSubmission(generics.UpdateAPIView):
    queryset = FeedbackSubmission.objects.all()
    permission_classes = (IsAuthenticated, UserIsEmployeesCoach,)
    serializer_class = CoachEditFeedbackSubmissionSerializer

    def get_employee(self):
        submission = self.get_object()
        return submission.subject


@api_view(['POST'])
def add_submission_to_digest(request, employee_id):
    employee = Employee.objects.get(pk=employee_id)
    if not request.user.employee == employee.coach:
        raise PermissionDenied
    if not FeedbackDigest.objects.filter(subject=employee, has_been_delivered=False).exists():
        digest = FeedbackDigest(subject=employee)
        digest.save()
        success_status_code = status.HTTP_201_CREATED
    else:
        digest = FeedbackDigest.objects.filter(subject=employee, has_been_delivered=False).first()
        success_status_code = status.HTTP_204_NO_CONTENT

    serializer = AddSubmissionToDigestSerializer(data=request.data)

    if serializer.is_valid():
        digest.submissions.add(serializer.validated_data['submission'])
        return Response(status=success_status_code)
    return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
