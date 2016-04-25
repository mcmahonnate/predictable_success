from rest_framework.decorators import api_view
from rest_framework.generics import *
from rest_framework import status
from ..models import PerceivedQualitiesReport, QualityCluster, PerceptionRequest
from serializers import *
from org.api.permissions import UserIsEmployee
from org.models import Employee
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def perceived_qualities_report(request):
    employee = Employee.objects.get(user=request.user)
    report = PerceivedQualitiesReport(employee=employee)
    report.load()

    serializer = PerceivedQualitiesReportSerializer(report)
    return Response(serializer.data)


# QualityCluster
class QualityClusters(ListAPIView):
    serializer_class = MinimalQualityClusterSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return QualityCluster.objects.all()


class RetrieveQualityCluster(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = QualityClusterSerializer
    queryset = QualityCluster.objects.all()


# PerceivedQuality
class CreatePerceivedQuality(CreateAPIView):
    serializer_class = CreatePerceivedQualitySerializer
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
        serializer.save(reviewer=self.request.user.employee)


class CreatePerceptionRequest(CreateAPIView):
    serializer_class = CreatePerceptionRequestSerializer
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


class RecentPerceptionRequestsIveSentList(ListAPIView):
    serializer_class = PerceptionRequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return PerceptionRequest.objects.recent_perception_requests_ive_sent_that_have_not_been_completed(requester=self.request.user.employee)


class RetrievePerceptionRequest(RetrieveAPIView):
    permission_classes = (IsAuthenticated, UserIsEmployee)
    serializer_class = PerceptionRequestSerializer
    queryset = PerceptionRequest.objects.all()

    def get_employee(self):
        request = self.get_object()
        return request.reviewer


class PerceptionRequestsToDoList(ListAPIView):
    serializer_class = PerceptionRequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Return all PerceptionRequests sent to the user that haven't been completed.
        """
        return PerceptionRequest.objects.pending_for_reviewer(self.request.user.employee)