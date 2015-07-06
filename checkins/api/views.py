from rest_framework import generics, views
from rest_framework.response import Response
from ..models import CheckIn, CheckInType
from .serializers import CheckInSerializer, AddEditCheckInSerializer, CheckInTypeSerializer


class CheckInTypeList(views.APIView):
    def get(self, request):
        qs = CheckInType.objects.all()
        serializer = CheckInTypeSerializer(qs, many=True)
        return Response(serializer.data)


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
    serializer_class = AddEditCheckInSerializer

    def perform_create(self, serializer):
        serializer.save(host=self.request.user.employee)


class RetrieveUpdateDestroyCheckIn(generics.RetrieveUpdateDestroyAPIView):
    queryset = CheckIn.objects.all()
    serializer_class = CheckInSerializer
