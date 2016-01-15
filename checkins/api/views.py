from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.generics import *
from blah.api.views import CommentList, CreateComment
from blah.api.serializers import CommentSerializer
from ..models import CheckIn, CheckInType, CheckInRequest
from .serializers import *
from .permissions import *
from talentdashboard.views.views import StandardResultsSetPagination


# CheckIn views
class CreateCheckIn(CreateAPIView):
    """ Create a CheckIn via POST.
    """
    serializer_class = AddEditCheckInSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(host=self.request.user.employee)


class CreateCheckInRequest(CreateAPIView):
    serializer_class = CreateCheckInRequestSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user.employee)


class MyCheckInRequests(ListAPIView):
    serializer_class = CheckInRequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        print 'get queryset'
        return CheckInRequest.objects.unanswered_for_requester(requester=self.request.user.employee)


class CheckInRequestToDos(ListAPIView):
    serializer_class = CheckInRequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Return all CheckInRequests sent to the user that haven't been completed.
        """
        return CheckInRequest.objects.pending_for_host(host=self.request.user.employee)


class RetrieveUpdateDestroyCheckIn(RetrieveUpdateDestroyAPIView):
    """ Retrieve, Update, or Delete a CheckIn via GET, PUT, DELETE.
    """
    queryset = CheckIn.objects.all()
    permission_classes = (IsAuthenticated, UserIsEmployeeOrHostOfCheckIn)
    serializer_class = AddEditCheckInSerializer

    def get_checkin(self):
        try:
            return self.get_object()
        except CheckIn.DoesNotExist:
            raise Http404()

    def get(self, request, pk, format=None):
        check_in = CheckIn.objects.get(id=pk)
        if request.user.employee.id == check_in.employee.id:
            if check_in.published:
                serializer = SharedEmployeeCheckInSerializer(check_in, context={'request': request})
            else:
                serializer = EmployeeCheckInSerializer(check_in, context={'request': request})
        else:
            serializer = CheckInSerializer(check_in, context={'request': request})
        return Response(serializer.data)


class RetrieveMyCheckIns(ListAPIView):
    permission_classes = (IsAuthenticated, CheckInsAreShareable)
    serializer_class = EmployeeCheckInSerializer

    def get_queryset(self):
        try:
            employee = self.request.user.employee
            checkins = CheckIn.objects.get_all_visible_to_employee(employee=employee)
            return checkins
        except CheckIn.DoesNotExist:
            raise Http404()


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
    permission_classes = (IsAuthenticated, UserCanSeeCheckInConversation)
    pagination_class = StandardResultsSetPagination

    def get_checkin(self):
        try:
            return self.get_object()
        except CheckIn.DoesNotExist:
            raise Http404()

    def get_object(self):
        pk = self.kwargs['pk']
        return CheckIn.objects.get(pk=pk)


class SendCheckInToEmployee(GenericAPIView):
    queryset = CheckIn.objects.all()
    serializer_class = CheckInSerializer
    permission_classes = (IsAuthenticated, UserIsHostOfCheckIn)

    def get_checkin(self):
        try:
            return self.get_object()
        except CheckIn.DoesNotExist:
            raise Http404()

    def put(self, request, pk, format=None):
        checkin = self.get_checkin()
        checkin.visible_to_employee = True
        checkin.save(update_fields=['visible_to_employee'])
        serializer = CheckInSerializer(checkin, context={'request':request})
        return Response(serializer.data)

class ShareCheckIn(GenericAPIView):
    queryset = CheckIn.objects.all()
    serializer_class = SharedEmployeeCheckInSerializer
    permission_classes = (IsAuthenticated, UserIsEmployeeOfCheckIn)

    def get_checkin(self):
        try:
            return self.get_object()
        except CheckIn.DoesNotExist:
            raise Http404()

    def put(self, request, pk, format=None):
        checkin = self.get_checkin()
        checkin.published = True
        checkin.save(update_fields=['published'])
        serializer = SharedEmployeeCheckInSerializer(checkin, context={'request':request})
        return Response(serializer.data)
