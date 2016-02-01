from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import *
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from dateutil import parser
from serializers import *
from org.models import Employee
from org.api.permissions import UserIsEmployee, UserIsCoachOfEmployee
from ..models import FeedbackRequest, FeedbackProgressReport, FeedbackProgressReports, FeedbackDigest, EmployeeFeedbackReports, EmployeeSubmissionReport
from permissions import UserIsEmployeeOrDigestDeliverer, UserIsSubjectOrReviewerOrCoach

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
        return FeedbackRequest.objects.recent_feedback_requests_ive_sent_that_have_not_been_delivered(requester=self.request.user.employee)


class RetrieveFeedbackRequest(RetrieveAPIView):
    permission_classes = (IsAuthenticated, UserIsEmployee)
    serializer_class = FeedbackRequestSerializer
    queryset = FeedbackRequest.objects.all()

    def get_employee(self):
        request = self.get_object()
        return request.reviewer

# FeedbackSubmission
class CreateFeedbackSubmission(CreateAPIView):
    serializer_class = CreateFeedbackSubmissionSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user.employee)


class RetrieveFeedbackSubmission(RetrieveAPIView):
    permission_classes = (IsAuthenticated, UserIsSubjectOrReviewerOrCoach)
    queryset = FeedbackSubmission.objects.all()

    def get_submission(self):
        return self.get_object()

    def get_serializer_class(self):
        employee_making_the_request = self.request.user.employee
        submission = self.get_object()
        if employee_making_the_request == submission.subject.coach:
            return FeedbackSubmissionSerializerForCoaches
        if employee_making_the_request == submission.subject:
            return FeedbackSubmissionSerializerForEmployee
        if employee_making_the_request == submission.reviewer:
            return FeedbackSubmissionSerializerForReviewer
        raise Exception("Can't determine which serializer class to use")


class RetrieveMyFeedbackSubmissions(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FeedbackSubmissionSerializerForReviewer

    def get_queryset(self):
        try:
            employee = self.request.user.employee
            submissions = FeedbackSubmission.objects.submitted(reviewer=employee)
            return submissions
        except FeedbackSubmission.DoesNotExist:
            raise Http404()


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
        return Employee.objects.get_current_employees(show_hidden=True).exclude(id__in=ids_to_exclude)


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
def feedback_progress_reports(request):
    try:
        report = FeedbackProgressReports(request.user.employee)
        report.load()
        serializer = FeedbackProgressReportCountsSerializer(report.progress_reports, many=True)
        return Response(serializer.data)
    except Employee.DoesNotExist:
        raise Http404()


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def feedback_progress_report(request, employee_id):
    try:
        employee = Employee.objects.get(pk=employee_id)
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
def employee_feedback_report(request):
    try:
        start_date = request.QUERY_PARAMS.get('start_date', None)
        end_date = request.QUERY_PARAMS.get('end_date', None)
        start_date = parser.parse(start_date).date()
        end_date = parser.parse(end_date).date()
        report = EmployeeFeedbackReports({'start_date': start_date, 'end_date': end_date})
        report.load()
        serializer = EmployeeFeedbackReportsSerializer(report)
        return Response(serializer.data)
    except AttributeError:
        raise Http404()


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def employee_submission_report(request):
    try:
        report = EmployeeSubmissionReport({'employee_id': request.user.employee.id})
        report.load()
        serializer = EmployeeSubmissionReportSerializer(report)
        return Response(serializer.data)
    except AttributeError:
        raise Http404()


class CoachUpdateFeedbackSubmission(generics.UpdateAPIView):
    queryset = FeedbackSubmission.objects.all()
    permission_classes = (IsAuthenticated, UserIsCoachOfEmployee,)
    serializer_class = CoachEditFeedbackSubmissionSerializer

    def get_employee(self):
        submission = self.get_object()
        return submission.subject

class EmployeeUpdateFeedbackSubmission(generics.UpdateAPIView):
    queryset = FeedbackSubmission.objects.all()
    permission_classes = (IsAuthenticated, UserIsEmployee)
    serializer_class = EmployeeEditFeedbackSubmissionSerializer

    def get_employee(self):
        submission = self.get_object()
        return submission.subject

class RetrieveMyFeedbackDigests(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FeedbackDigestSerializerForEmployee

    def get_queryset(self):
        try:
            employee = self.request.user.employee
            digests = FeedbackDigest.objects.get_all_delivered_for_employee(employee=employee)
            return digests
        except FeedbackDigest.DoesNotExist:
            raise Http404()


class RetrieveFeedbackDigestsIveDelivered(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SummarizedFeedbackDigestSerializer

    def get_queryset(self):
        try:
            employee = self.request.user.employee
            digests = FeedbackDigest.objects.get_all_ive_delivered(employee=employee)
            return digests
        except FeedbackDigest.DoesNotExist:
            raise Http404()


class RetrieveFeedbackDigest(RetrieveAPIView):
    permission_classes = (IsAuthenticated, UserIsEmployeeOrDigestDeliverer)
    queryset = FeedbackDigest.objects.all()

    def get_digest(self):
        try:
            return self.get_object()
        except FeedbackDigest.DoesNotExist:
            raise Http404()

    def get_serializer_class(self):
        employee_making_the_request = self.request.user.employee
        digest = self.get_object()
        if employee_making_the_request == digest.delivered_by:
            return FeedbackDigestSerializerForCoaches
        if employee_making_the_request == digest.subject:
            return FeedbackDigestSerializerForEmployee
        raise Exception("Can't determine which serializer class to use")


class ShareFeedbackDigest(GenericAPIView):
    permission_classes = (IsAuthenticated, UserIsEmployee)
    queryset = FeedbackDigest.objects.all()

    def get_employee(self):
        digest = self.get_object()
        return digest.subject

    def post(self, request, pk):
        digest = self.get_object()
        employee_id = request.DATA['share_with_id']
        employee = Employee.objects.get(pk=employee_id)
        digest.share(share_with=employee)
        return Response(status=status.HTTP_204_NO_CONTENT)


class RetrieveUpdateCurrentFeedbackDigest(APIView):
    permission_classes = (IsAuthenticated, UserIsCoachOfEmployee)

    def get_employee(self):
        try:
            return Employee.objects.get(pk=self.kwargs['employee_id'])
        except Employee.DoesNotExist:
            raise Http404()

    def get(self, request, employee_id):
        try:
            employee = self.get_employee()
            digest = FeedbackDigest.objects.get(subject=employee, has_been_delivered=False)
            serializer = FeedbackDigestSerializerForCoaches(digest)
            return Response(serializer.data)
        except FeedbackDigest.DoesNotExist:
            raise Http404()

    def post(self, request, employee_id):
        serializer = EditFeedbackDigestSerializer(data=request.data)
        if serializer.is_valid():
            employee = self.get_employee()
            digest = FeedbackDigest.objects.get(subject=employee, has_been_delivered=False)
            if 'summary' in serializer.validated_data:
                digest.summary = serializer.validated_data['summary']
                digest.save(update_fields=['summary'])
            if digest.has_been_delivered is False and 'has_been_delivered' in serializer.validated_data:
                has_been_delivered = serializer.validated_data['has_been_delivered']
                if has_been_delivered:
                    digest.deliver(request.user.employee)
                    digest.save(update_fields=['has_been_delivered'])
            serializer = FeedbackDigestSerializerForEmployee(digest)
            return Response(serializer.data)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddRemoveDigestSubmission(APIView):
    permission_classes = (IsAuthenticated, UserIsCoachOfEmployee)

    def get_employee(self):
        try:
            return Employee.objects.get(pk=self.kwargs['employee_id'])
        except Employee.DoesNotExist:
            raise Http404()

    def get_digest(self):
        employee = self.get_employee()
        if not FeedbackDigest.objects.filter(subject=employee, has_been_delivered=False).exists():
            digest = FeedbackDigest(subject=employee)
            digest.save()
        else:
            digest = FeedbackDigest.objects.filter(subject=employee, has_been_delivered=False).first()
        return digest

    def post(self, request, employee_id):
        digest = self.get_digest()
        serializer = AddRemoveSubmissionToDigestSerializer(data=request.data)
        if serializer.is_valid():
            digest.submissions.add(serializer.validated_data['submission'])
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, employee_id):
        digest = self.get_digest()
        serializer = AddRemoveSubmissionToDigestSerializer(data=request.data)
        if serializer.is_valid():
            digest.submissions.remove(serializer.validated_data['submission'])
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)