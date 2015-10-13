from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from serializers import *
from org.models import Employee
from ..models import FeedbackRequest, FeedbackProgressReport


# FeedbackRequest
class CreateFeedbackRequest(CreateAPIView):
    serializer_class = CreateFeedbackRequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        kwargs['many'] = isinstance(self.request.DATA, list)
        return serializer_class(*args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user.employee)


class RetrieveFeedbackRequest(RetrieveAPIView):
    serializer_class = FeedbackRequestSerializer
    queryset = FeedbackRequest.objects.all()


# FeedbackSubmission
class CreateFeedbackSubmission(CreateAPIView):
    serializer_class = CreateFeedbackSubmissionSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user.employee)


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


@api_view(['GET'])
def feedback_progress_report(request, pk):
    try:
        employee = Employee.objects.get(pk=pk)
        #if request.user.employee is not employee.coach:
        #    raise PermissionDenied
        report = FeedbackProgressReport(employee)
        report.load()
        serializer = FeedbackProgressReportSerializer(report)
        return Response(serializer.data)
    except Employee.DoesNotExist:
        raise Http404()
