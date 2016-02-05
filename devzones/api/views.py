from org.api.permissions import UserIsEmployeeOrLeaderOrCoachOfEmployee, UserIsEmployee
from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import *


# CheckIn views
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
    permission_classes = (IsAuthenticated, UserIsEmployee)
    serializer_class = UpdateEmployeeZoneSerializer

    def get_employee(self):
        zone = self.get_object()
        return zone.employee

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        serializer = EmployeeZoneSerializer(instance, context={'request': request})
        return Response(serializer.data)


class RetrieveMyTeamLeadConversations(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ConversationSerializer

    def get_queryset(self):
        try:
            employee = self.request.user.employee
            zones = Conversation.objects.get_conversations_for_lead(development_lead=employee)
            return zones
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
