from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.generics import *
from blah.api.views import CommentList, CreateComment
from blah.api.serializers import CommentSerializer
from ..models import CheckIn, CheckInType
from .serializers import CheckInSerializer, AddEditCheckInSerializer, CheckInTypeSerializer
from .permissions import *
from talentdashboard.views.views import StandardResultsSetPagination


# CheckIn views
class CreateCheckIn(CreateAPIView):
    """ Create a CheckIn via POST.
    """
    serializer_class = AddEditCheckInSerializer
    permission_classes = (IsAuthenticated,)
    model = CheckIn

    def perform_create(self, serializer):
        serializer.save(host=self.request.user.employee)


class RetrieveUpdateDestroyCheckIn(RetrieveUpdateDestroyAPIView):
    """ Retrieve, Update, or Delete a CheckIn via GET, PUT, DELETE.
    """
    queryset = CheckIn.objects.all()
    permission_classes = (IsAuthenticated, UserIsEmployeeOrHost)
    serializer_class = AddEditCheckInSerializer

    def get_checkin(self):
        try:
            return self.get_object()
        except CheckIn.DoesNotExist:
            raise Http404()

    def get(self, request, pk, format=None):
        check_in = CheckIn.objects.get(id=pk)
        serializer = CheckInSerializer(check_in, context={'request': request})
        return Response(serializer.data)


class RetrieveMyCheckIns(ListAPIView):
    permission_classes = (IsAuthenticated, CheckInsAreShareable)
    serializer_class = CheckInSerializer

    def get_queryset(self):
        try:
            employee = self.request.user.employee
            checkins = CheckIn.objects.get_all_visible_to_employee(employee=employee)
            return checkins
        except CheckIn.DoesNotExist:
            raise Http404()


class EmployeeCheckInList(ListAPIView):
    """ Get a list of CheckIns for a given employee via employee_id query param.
    """
    serializer_class = CheckInSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        employee_id = self.kwargs['employee_id']
        return CheckIn.objects.filter(employee_id=employee_id)


class HostCheckInList(ListAPIView):
    """ Get a list of CheckIns where the current user is the host.
    """
    serializer_class = CheckInSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        host = self.request.user.employee
        return CheckIn.objects.filter(host=host)


# CheckInType views
class CheckInTypeList(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CheckInTypeSerializer
    queryset = CheckInType.objects.all()


# Comment views
class CreateCheckinComment(CreateComment):
    queryset = CheckIn.objects.all()


class CheckInCommentList(CommentList):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = StandardResultsSetPagination

    def get_object(self):
        pk = self.kwargs['pk']
        return CheckIn.objects.get(pk=pk)


