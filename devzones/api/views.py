from dateutil import parser
from org.api.permissions import UserIsEmployeeOrLeaderOrCoachOfEmployee, UserIsEmployee, PermissionsViewAllEmployees
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
from .permissions import UserIsConversationParticipantOrHasAllAccess, UserIsAssessorOrHasAllAccess, UserIsAssessor, UserIsMeetingParticipantOrHasAllAccess, UserIsConversationParticipantOrHasAllAccessOrIsEmployee
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
    permission_classes = (IsAuthenticated, PermissionsViewAllEmployees)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        saved = self.perform_create(serializer)
        serializer = MeetingSerializer(instance=saved, context={'request': request})

        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()


class UpdateMeeting(UpdateAPIView):
    queryset = Meeting.objects.all()
    serializer_class = CreateUpdateMeetingSerializer
    permission_classes = (IsAuthenticated, PermissionsViewAllEmployees)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        serializer = MeetingSerializer(instance, context={'request': request})
        return Response(serializer.data)


class ActivateMeeting(GenericAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = (IsAuthenticated, PermissionsViewAllEmployees)

    def put(self, request, pk, format=None):
        meeting = self.get_object()
        meeting.active = True
        meeting.save(update_fields=['active'])
        serializer = MeetingSerializer(meeting, context={'request':request})
        return Response(serializer.data)


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
    permission_classes = (IsAuthenticated, UserIsAssessorOrHasAllAccess,)
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


class ShareEmployeeZone(GenericAPIView):
    queryset = EmployeeZone.objects.all()
    serializer_class = EmployeeZoneSerializer
    permission_classes = (IsAuthenticated, UserIsAssessor)

    def get_employee_zone(self):
        try:
            return self.get_object()
        except EmployeeZone.DoesNotExist:
            raise Http404()

    def put(self, request, pk, format=None):
        employee_zone = self.get_employee_zone()
        employee_zone.is_draft = False
        employee_zone.completed = True
        employee_zone.save(update_fields=['completed', 'is_draft'])
        serializer = EmployeeZoneSerializer(employee_zone, context={'request':request})
        return Response(serializer.data)


class CreateManyConversations(CreateAPIView):
    serializer_class = CreateConversationSerializer
    permission_classes = (IsAuthenticated, PermissionsViewAllEmployees)

    def create(self, request, *args, **kwargs):
        created = []
        for conversation in request.data:
            serializer = self.get_serializer(data=conversation, many=False)
            serializer.is_valid(raise_exception=True)
            try:
                instance = Conversation.objects.filter(employee__id=conversation['employee'], completed=False).latest('date')
                development_lead = Employee.objects.get(id=conversation['development_lead'])
                instance.meeting = Meeting.objects.get(id=conversation['meeting'])
                instance.development_lead = development_lead
                instance.save()
                if instance.development_lead_assessment:
                    instance.development_lead_assessment.assessor = development_lead
                    instance.development_lead_assessment.save()
            except Conversation.DoesNotExist:
                instance = self.perform_create(serializer)
            created.append(instance)
        serializer = ConversationSerializer(instance=created, many=True, context={'request': request})
        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()


class UpdateManyConversations(UpdateAPIView):
    serializer_class = UpdateConversationSerializer
    permission_classes = (IsAuthenticated, PermissionsViewAllEmployees)

    def update(self, request, *args, **kwargs):
        updated = []
        for conversation in request.data:
            instance = Conversation.objects.get(id=conversation['id'])
            serializer = self.get_serializer(instance=instance, data=conversation, many=False, partial=True)
            serializer.is_valid(raise_exception=True)
            saved = self.perform_update(serializer)
            updated.append(saved)
        serializer = ConversationSerializer(instance=updated, many=True, context={'request': request})
        return Response(serializer.data)

    def perform_update(self, serializer):
        return serializer.save()


class DeleteManyConversations(DestroyAPIView):
    serializer_class = UpdateConversationSerializer
    permission_classes = (IsAuthenticated, PermissionsViewAllEmployees)

    def destroy(self, request, *args, **kwargs):
        print request.data
        for conversation in request.data:
            instance = Conversation.objects.get(id=conversation['id'])
            print instance
            instance.delete()
        return Response(status=HTTP_204_NO_CONTENT)


class RetrieveUpdateConversation(RetrieveUpdateAPIView):
    queryset = Conversation.objects.all()
    permission_classes = (IsAuthenticated, UserIsConversationParticipantOrHasAllAccessOrIsEmployee)
    serializer_class = UpdateConversationSerializer

    def get_conversation(self):
        return self.get_object()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if request.user.employee.id == instance.employee.id:
            serializer = ConversationForEmployeeSerializer(instance, context={'request': request})
        elif request.user.employee.id == instance.development_lead.id:
            serializer = ConversationDevelopmentLeadSerializer(instance, context={'request': request})
        elif self.request.user.has_perm('org.view_employees'):
            serializer = ConversationSerializer(instance, context={'request': request})
        else:
            serializer = ConversationForEmployeeSerializer(instance, context={'request': request})
        return Response(serializer.data)


    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.employee.id == instance.employee.id:
            serializer = ConversationForEmployeeSerializer(instance, context={'request': request})
        elif request.user.employee.id == instance.development_lead.id:
            serializer = ConversationDevelopmentLeadSerializer(instance, context={'request': request})
        elif self.request.user.has_perm('org.view_employees'):
            serializer = ConversationSerializer(instance, context={'request': request})
        else:
            serializer = ConversationForEmployeeSerializer(instance, context={'request': request})
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
    serializer_class = ConversationDevelopmentLeadSerializer

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
        if not conversation:
            raise Http404()
        serializer = SanitizedConversationSerializer(conversation, context={'request': request})
        return Response(serializer.data)


class RetrieveMyConversations(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ConversationForEmployeeSerializer

    def get_queryset(self):
        try:
            employee = self.request.user.employee
            conversations = Conversation.objects.get_all_completed_for_employee(employee)
            return conversations
        except Conversation.DoesNotExist:
            raise Http404()


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
