from rest_framework import views
from rest_framework.response import Response
from ..models import Event
from .serializers import EventSerializer
from talentdashboard.views.views import StandardResultsSetPagination


class EmployeeEventList(views.APIView):
    """ Get a list of Events for a given employee via employee_id query param.
    """
    def get(self, request, **kwargs):
        employee_id = kwargs['employee_id']
        qs = Event.objects.filter(employee_id=employee_id)
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(qs, request)
        serializer = EventSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

class EventList(views.APIView):
    """ Retrieve all Events
    """
    def get(self, request):
        qs = Event.objects.all()
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(qs, request)
        serializer = EventSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)