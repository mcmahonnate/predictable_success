from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import *
from serializers import *
from org.models import Employee
from ..models import FeedbackRequest


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


class CreateFeedbackSubmission(CreateAPIView):
    serializer_class = CreateFeedbackSubmissionSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user.employee)


class PotentialReviewers(ListAPIView):
    serializer_class = SanitizedEmployeeSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Return all Employees, excluding the current user as well
        as anyone that they have pending requests for.
        """
        requester = self.request.user.employee
        current_requests = FeedbackRequest.objects.pending_for_requester(requester)
        employees_to_exclude = [feedback_request.reviewer for feedback_request in current_requests]
        requester = Employee.objects.get_from_user(self.request.user)
        employees_to_exclude.append(requester)
        ids_to_exclude = [e.id for e in employees_to_exclude]
        return Employee.objects.exclude(id__in=ids_to_exclude)


class FeedbackRequestsThatHaventBeenRespondedTo(ListAPIView):
    serializer_class = FeedbackRequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Return all FeedbackRequests that the user has sent that have not
        been completed.
        """
        return FeedbackRequest.objects.pending_for_requester(self.request.user.employee)


class FeedbackRequestsToDoList(ListAPIView):
    serializer_class = FeedbackRequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Return all FeedbackRequests sent to the user that haven't been completed.
        """
        return FeedbackRequest.objects.pending_for_reviewer(self.request.user.employee)

class FeedbackSubmissionsForEmployee(ListAPIView):
    serializer_class = FeedbackSubmissionSerializerForCoaches
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Return all FeedbackSubmissions for an Employee.
        """
        pk = self.kwargs['pk']
        employee = Employee.objects.get(id=pk)
        return FeedbackSubmission.objects.for_subject(employee)