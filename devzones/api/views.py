from dateutil import parser
from org.api.permissions import UserIsEmployeeOrLeaderOrCoachOfEmployee, UserIsEmployee, PermissionsViewAllEmployees
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .permissions import UserIsConversationParticipantOrHasAllAccess, UserIsAssessor, UserIsMeetingParticipantOrHasAllAccess, UserIsConversationParticipantOrHasAllAccessOrIsEmployee
from .serializers import *


# DevZone views
class CreateEmployeeZone(CreateAPIView):
    serializer_class = CreateEmployeeZoneSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        saved = self.perform_create(serializer)
        serializer = EmployeeZoneSerializer(instance=saved, context={'request': request})

        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()


class RetrieveEmployeeZone(RetrieveAPIView):
    serializer_class = EmployeeZoneSerializer
    permission_classes = (IsAuthenticated, UserIsEmployeeOrLeaderOrCoachOfEmployee)
    queryset = EmployeeZone.objects.all()

    def get_employee(self):
        zone = self.get_employee_zone()
        return zone.employee

    def get_employee_zone(self):
        try:
            return self.get_object()
        except EmployeeZone.DoesNotExist:
            raise Http404()


class RetrieveMeeting(RetrieveAPIView):
    serializer_class = MeetingSerializer
    permission_classes = (IsAuthenticated, UserIsMeetingParticipantOrHasAllAccess)
    queryset = Meeting.objects.all()

    def get_meeting(self):
        return self.get_object()


class CreateMeeting(CreateAPIView):
    serializer_class = CreateUpdateMeetingSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        saved = self.perform_create(serializer)
        serializer = MeetingSerializer(instance=saved, context={'request': request})

        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()


class RetrieveMyEmployeeZones(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = EmployeeZoneSerializer

    def get_queryset(self):
        try:
            employee = self.request.user.employee
            zones = EmployeeZone.objects.get_all_finished_for_employee(employee=employee)
            return zones
        except EmployeeZone.DoesNotExist:
            raise Http404()


class RetrieveZones(ListAPIView):
    queryset = Zone.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ZoneSerializer


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
    permission_classes = (IsAuthenticated, UserIsAssessor)
    serializer_class = UpdateEmployeeZoneSerializer

    def get_employee_zone(self):
        return self.get_object()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        serializer = EmployeeZoneSerializer(instance, context={'request': request})
        return Response(serializer.data)


class CreateManyConversations(CreateAPIView):
    serializer_class = CreateConversationSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        saved = self.perform_create(serializer)
        serializer = ConversationSerializer(instance=saved, many=True, context={'request': request})
        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()


class RetrieveUpdateConversation(RetrieveUpdateAPIView):
    queryset = Conversation.objects.all()
    permission_classes = (IsAuthenticated, UserIsConversationParticipantOrHasAllAccessOrIsEmployee)
    serializer_class = UpdateConversationSerializer

    def get_conversation(self):
        return self.get_object()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ConversationSerializer(instance, context={'request': request})
        return Response(serializer.data)


class RetakeEmployeeZone(GenericAPIView):
    queryset = EmployeeZone.objects.all()
    serializer_class = EmployeeZoneSerializer
    permission_classes = (IsAuthenticated, UserIsEmployee)

    def get_employee(self):
        employee_zone = self.get_object()
        return employee_zone.employee

    def put(self, request, pk, format=None):
        employee_zone = self.get_object()
        employee_zone.answers = []
        employee_zone.last_question_answered = None
        employee_zone.zone = None
        employee_zone.zones = []
        employee_zone.notes = ''
        employee_zone.times_retaken += 1
        employee_zone.save()
        serializer = EmployeeZoneSerializer(employee_zone, context={'request':request})
        return Response(serializer.data)


class RetrieveMeetingConversations(ListAPIView):
    permission_classes = (IsAuthenticated, UserIsMeetingParticipantOrHasAllAccess)
    serializer_class = ConversationSerializer

    def get_meeting(self):
        return self.get_object()

    def get_queryset(self):
        try:
            employee = self.request.user.employee
            meeting = Meeting.objects.get(id=self.kwargs['pk'])
            conversations = Conversation.objects.get_for_meeting(meeting=meeting)
            conversations = conversations.exclude(employee=employee)
            return conversations
        except Conversation.DoesNotExist:
            raise Http404()


class RetrieveMyTeamLeadConversations(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ConversationSerializer

    def get_queryset(self):
        try:
            employee = self.request.user.employee
            conversations = Conversation.objects.get_conversations_for_lead(development_lead=employee)
            conversations = conversations.exclude(employee=employee)
            return conversations
        except Conversation.DoesNotExist:
            raise Http404()


class RetrieveMyCurrentConversation(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, format=None):
        employee = self.request.user.employee
        conversation = Conversation.objects.get_current_for_employee(employee=employee)
        if conversation is None:
            raise Http404()
        serializer = SanitizedConversationSerializer(conversation, context={'request': request})
        return Response(serializer.data)


class RetrieveMyCurrentMeetings(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SanitizedMeetingSerializer

    def get_queryset(self):
        try:
            employee = self.request.user.employee
            if self.request.user.has_perm('org.view_employees'):
                meetings = Meeting.objects.get_all_current()
            else:
                meetings = Meeting.objects.get_all_for_employee(employee)
            meetings = meetings.exclude(conversations__employee__id=employee.id)
            return meetings
        except Meeting.DoesNotExist:
            raise Http404()


@api_view(['GET'])
@permission_classes((IsAuthenticated, PermissionsViewAllEmployees))
def devzone_report(request):
    try:
        start_date = request.QUERY_PARAMS.get('start_date', None)
        end_date = request.QUERY_PARAMS.get('end_date', None)
        start_date = parser.parse(start_date).date()
        end_date = parser.parse(end_date).date()
        zones = EmployeeZone.objects.filter(date__lte=end_date, date__gte=start_date, employee=F('assessor'))
        serializer = EmployeeZoneReportSerializer(zones, context={'request':request}, many=True)
        return Response(serializer.data)
    except AttributeError:
        raise Http404()
