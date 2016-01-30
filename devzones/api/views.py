from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import *
from .permissions import *


# CheckIn views
class CreateEmployeeZone(CreateAPIView):
    serializer_class = CreateEmployeeZoneSerializer
    permission_classes = (IsAuthenticated,)


class RetrieveEmployeeZone(RetrieveAPIView):
    serializer_class = EmployeeZoneSerializer
    permission_classes = (IsAuthenticated, UserIsEmployeeOfEmployeeZone)
    queryset = EmployeeZone.objects.all()

    def get_employee_zone(self):
        try:
            return self.get_object()
        except EmployeeZone.DoesNotExist:
            raise Http404()


class RetrieveUnfinishedEmployeeZone(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, format=None):
        employee = self.request.user.employee
        employee_zone = EmployeeZone.objects.get_unfinished(employee=employee)
        if employee_zone is None:
            raise Http404()
        serializer = EmployeeZoneSerializer(employee_zone, context={'request': request})
        return Response(serializer.data)


class UpdateEmployeeZone(RetrieveUpdateAPIView):
    queryset = EmployeeZone.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = UpdateEmployeeZoneSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        serializer = EmployeeZoneSerializer(instance, context={'request': request})
        return Response(serializer.data)