from blah.models import Comment
from checkins.models import CheckIn
from django.http import Http404
from django.contrib.contenttypes.models import ContentType
from org.api.permissions import PermissionsViewThisEmployee
from org.models import Employee
from rest_framework import views
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from talentdashboard.views.views import StandardResultsSetPagination, PermissionsViewAllEmployees
from .serializers import EventSerializer, ThirdPartySerializer
from ..models import Event, ThirdParty, ThirdPartyEvent


def exclude_third_party_events(request):
    request.QUERY_PARAMS.get('exclude_third_party_events', '')
    exclude = True
    if request.QUERY_PARAMS.get('exclude_third_party_events', '').lower() == 'false':
        exclude = False
    return exclude


class EmployeeEventList(views.APIView):
    permission_classes = (IsAuthenticated,)

    """ Get a list of Events for a given employee via employee_id query param.
    """
    def get(self, request, **kwargs):
        requester = Employee.objects.get(user__id=request.user.id)
        employee_id = kwargs['employee_id']
        employee = Employee.objects.get(id=employee_id)
        if not employee.is_viewable_by_user(request.user):
            raise PermissionDenied
        type = request.GET.get('type', '')
        third_party = request.GET.get('third_party', '')
        exclude = exclude_third_party_events(request)
        """Filter by content type
        """
        if type:
            try:
                content_type = ContentType.objects.get(model=type)
                qs = Event.objects.get_events_for_employee(requester=requester, employee=employee, exclude_third_party_events=exclude, type=content_type)
            except ContentType.DoesNotExist:
                return
            """Because we can have multiple Third parties (YEI for example is a third party) handled by one content_type
            we need an extra parameter, third_party, to specify the third party we want to show events for.
            """
            if third_party:
                third_party_event_content_type = ContentType.objects.get_for_model(ThirdPartyEvent)
                if content_type.id == third_party_event_content_type.id:
                    third_party_event_ids = ThirdPartyEvent.objects.filter(third_party__name=third_party, employee=employee).values_list('id', flat=True)
                    qs = qs.filter(event_id__in=third_party_event_ids)
        else:
            qs = Event.objects.get_events_for_employee(requester=requester, exclude_third_party_events=exclude, employee=employee)
        qs = qs.extra(order_by=['-date'])
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(qs, request)
        serializer = EventSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class EventList(views.APIView):
    permission_classes = (IsAuthenticated, PermissionsViewAllEmployees)

    """ Retrieve all Events
    """
    def get(self, request):
        requester = Employee.objects.get(user__id=request.user.id)
        exclude = exclude_third_party_events(request)
        qs = Event.objects.get_events_for_all_employees(requester=requester, exclude_third_party_events=exclude)
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(qs, request)
        serializer = EventSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


def _get_event_list_for_employees(request, requester, employee_ids, exclude_third_party_events=True):
    if not employee_ids:
        return Response(None, status=status.HTTP_404_NOT_FOUND)
    qs = Event.objects.get_events_for_employees(requester=requester, employee_ids=employee_ids, exclude_third_party_events=exclude_third_party_events)
    qs = qs.extra(order_by=['-date'])
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(qs, request)
    serializer = EventSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)


class MyTeamEventList(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        requester = Employee.objects.get(user__id=request.user.id)
        employees = requester.get_descendants()
        employee_ids = employees.filter(departure_date__isnull=True).values('id')
        exclude = exclude_third_party_events(request)
        return _get_event_list_for_employees(request=request, requester=requester, employee_ids=employee_ids, exclude_third_party_events=exclude)


class LeadEventList(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, format=None):
        requester = Employee.objects.get(user__id=request.user.id)
        lead = Employee.objects.get(id=pk)
        if requester.is_ancestor_of(other=lead, include_self=True):
            employees = lead.get_descendants()
            employee_ids = employees.filter(departure_date__isnull=True).values('id')
            exclude = exclude_third_party_events(request)
            return _get_event_list_for_employees(request=request, requester=requester, employee_ids=employee_ids, exclude_third_party_events=exclude)
        else:
            return Response(None, status=status.HTTP_403_FORBIDDEN)


class MyCoachEventList(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        requester = Employee.objects.get(user__id=request.user.id)
        employee_ids = Employee.objects.get_current_employees_by_coach(coach_id=requester.id).values('id')
        exclude = exclude_third_party_events(request)
        return _get_event_list_for_employees(request=request, requester=requester, employee_ids=employee_ids, exclude_third_party_events=exclude)


class CoachEventList(views.APIView):
    permission_classes = (IsAuthenticated, PermissionsViewThisEmployee)

    def get(self, request, pk, format=None):
        coach = Employee.objects.get(id=pk)
        requester = Employee.objects.get(user__id=request.user.id)
        employee_ids = Employee.objects.get_current_employees_by_coach(coach_id=coach.id).values('id')
        return _get_event_list_for_employees(request, requester, employee_ids)


class TeamEventList(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, format=None):
        requester = Employee.objects.get(user__id=request.user.id)
        employee_ids = Employee.objects.get_current_employees_by_team(team_id=pk).values('id')
        exclude = exclude_third_party_events(request)
        return _get_event_list_for_employees(request=request, requester=requester, employee_ids=employee_ids, exclude_third_party_events=exclude)


class ThirdPartyList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ThirdPartySerializer
    queryset = ThirdParty.objects.all()


class CheckInEventList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = EventSerializer

    def get_object(self):
        pk = self.kwargs['pk']
        return CheckIn.objects.get(pk=pk)

    def get_queryset(self):
        subject = self.get_object()
        return Event.objects.get_events_for_object(subject)


class CommentEvent(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = EventSerializer

    def get_object(self):
        pk = self.kwargs['pk']
        comment = Comment.objects.get(pk=pk)
        event = Event.objects.get_events_for_object(comment).first()
        if event is None:
            raise Http404
        return event
