from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated
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


class UpdateEmployeeZone(UpdateAPIView):
    queryset = EmployeeZone.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = UpdateEmployeeZoneSerializer