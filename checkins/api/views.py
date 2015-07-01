from rest_framework import generics
from ..models import CheckIn
from .serializers import CheckInSerializer, CreateCheckInSerializer


class EmployeeCheckInList(generics.ListAPIView):
    serializer_class = CheckInSerializer

    def get_queryset(self):
        employee_id = self.kwargs['employee_id']
        return CheckIn.objects.filter(employee_id=employee_id)


class HostCheckInList(generics.ListAPIView):
    serializer_class = CheckInSerializer

    def get_queryset(self):
        host = self.request.user.employee
        return CheckIn.objects.filter(host=host)


class CreateCheckIn(generics.CreateAPIView):
    serializer_class = CreateCheckInSerializer

    def perform_create(self, serializer):
        serializer.save(host=self.request.user.employee)
