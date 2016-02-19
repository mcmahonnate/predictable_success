from org.api.permissions import UserIsEmployeeOrLeaderOrCoachOfEmployee, UserIsEmployee
from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from org.api.permissions import PermissionsViewAllEmployees
from .permissions import UserIsConversationParticipant, UserIsAssessor
from .serializers import *


# DevZone views
class CreateEmployeeZone(CreateAPIView):
    serializer_class = CreateEmployeeZoneSerializer
    permission_classes = (IsAuthenticated,)


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
    permission_classes = (IsAuthenticated, PermissionsViewAllEmployees)
    queryset = Meeting.objects.all()


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


class RetrieveUpdateConversation(RetrieveUpdateAPIView):
    queryset = Conversation.objects.all()
    permission_classes = (IsAuthenticated, UserIsConversationParticipant)
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
        employee_zone.notes = ''
        employee_zone.times_retaken += 1
        employee_zone.save()
        serializer = EmployeeZoneSerializer(employee_zone, context={'request':request})
        return Response(serializer.data)


class RetrieveMeetingConversations(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ConversationSerializer

    def get_queryset(self):
        try:
            meeting = Meeting.objects.get(id=self.kwargs['pk'])
            conversations = Conversation.objects.get_for_meeting(meeting=meeting)
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
        serializer = ConversationSerializer(conversation, context={'request': request})
        return Response(serializer.data)


class RetrieveMyCurrentMeetings(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MeetingSerializer

    def get_queryset(self):
        try:
            employee = self.request.user.employee
            meetings = Meeting.objects.get_all_for_employee(employee)
            return meetings
        except Meeting.DoesNotExist:
            raise Http404()
