from rest_framework import views
from rest_framework.response import Response
from rest_framework import status
from ..models import Event
from .serializers import EventSerializer
from talentdashboard.views.views import StandardResultsSetPagination
from org.models import Employee


class EmployeeEventList(views.APIView):
    """ Get a list of Events for a given employee via employee_id query param.
    """
    def get(self, request, **kwargs):
        employee_id = kwargs['employee_id']
        qs = Event.objects.filter(employee__id=employee_id)
        qs = qs.extra(order_by=['-date'])
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(qs, request)
        serializer = EventSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

class EventList(views.APIView):
    """ Retrieve all Events
    """
    def get(self, request):
        qs = Event.objects.all()
        qs = qs.extra(order_by=['-date'])
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(qs, request)
        serializer = EventSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

class LeadEventList(views.APIView):
    def get(self, request, format=None):
        requester = Employee.objects.get(user__id=request.user.id)
        employee_ids = Employee.objects.get_current_employees_by_team_lead(lead_id=requester.id).values('id')
        if not employee_ids:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        qs = Event.objects.get_events_for_employees(requester=requester, employee_ids=employee_ids)
        qs = qs.extra(order_by=['-date'])
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(qs, request)
        serializer = EventSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

class CoachEventList(views.APIView):
    def get(self, request, format=None):
        requester = Employee.objects.get(user__id=request.user.id)
        employee_ids = Employee.objects.get_current_employees_by_coach(coach_id=requester.id).values('id')
        if not employee_ids:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        qs = Event.objects.get_events_for_employees(requester=requester, employee_ids=employee_ids)
        qs = qs.extra(order_by=['-date'])
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(qs, request)
        serializer = EventSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

class TeamEventList(views.APIView):
    def get(self, request, pk, format=None):
        requester = Employee.objects.get(user__id=request.user.id)
        employee_ids = Employee.objects.get_current_employees_by_team(team_id=pk).values('id')
        if not employee_ids:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        qs = Event.objects.get_events_for_employees(requester=requester, employee_ids=employee_ids)
        qs = qs.extra(order_by=['-date'])
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(qs, request)
        serializer = EventSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)