from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from ..models import CheckIn, CheckInType
from .serializers import CheckInSerializer, AddEditCheckInSerializer, CheckInTypeSerializer
from blah.api.views import CreateComment

# CheckIn views
class CreateCheckIn(generics.CreateAPIView):
    """ Create a CheckIn via POST.
    """
    serializer_class = AddEditCheckInSerializer
    permission_classes = (IsAuthenticated, DjangoModelPermissions)
    model = CheckIn

    def perform_create(self, serializer):
        serializer.save(host=self.request.user.employee)


class RetrieveUpdateDestroyCheckIn(generics.RetrieveUpdateDestroyAPIView):
    """ Retrieve, Update, or Delete a CheckIn via GET, PUT, DELETE.
    """
    queryset = CheckIn.objects.all()
    permission_classes = (IsAuthenticated, DjangoModelPermissions)
    serializer_class = AddEditCheckInSerializer

    def get(self, request, pk, format=None):
        check_in = CheckIn.objects.get(id=pk)
        serializer = CheckInSerializer(check_in, context={'request': request})
        return Response(serializer.data)


class EmployeeCheckInList(generics.ListAPIView):
    """ Get a list of CheckIns for a given employee via employee_id query param.
    """
    serializer_class = CheckInSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        employee_id = self.kwargs['employee_id']
        return CheckIn.objects.filter(employee_id=employee_id)


class HostCheckInList(generics.ListAPIView):
    """ Get a list of CheckIns where the current user is the host.
    """
    serializer_class = CheckInSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        host = self.request.user.employee
        return CheckIn.objects.filter(host=host)


# CheckInType views
class CheckInTypeList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CheckInTypeSerializer
    queryset = CheckInType.objects.all()


class CreateCheckinComment(CreateComment):
    queryset = CheckIn.objects.all()
