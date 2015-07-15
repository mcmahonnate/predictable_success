from rest_framework import generics, views
from rest_framework.response import Response
from ..models import Event
from .serializers import EventSerializer
from talentdashboard.views.views import StandardResultsSetPagination


class EmployeeEventList(generics.ListAPIView):
    """ Get a list of Events for a given employee via employee_id query param.
    """
    serializer_class = EventSerializer

    def get_queryset(self):
        employee_id = self.kwargs['employee_id']
        return Event.objects.filter(employee_id=employee_id)

class EventList(views.APIView):
    """ Retrieve all Events
    """
    def get(self, request):
        qs = Event.objects.all()
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(qs, request)
        serializer = EventSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)