from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from blah.api.serializers import CommentSerializer
from blah.api.views import CommentList
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.template import RequestContext
from django.shortcuts import render_to_response
from .serializers import EmployeeSerializer
from ..models import Employee, Leadership


class EmployeeCommentList(CommentList):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        pk = self.kwargs['pk']
        return Employee.objects.get(pk=pk)

class Profile(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        current_user = request.user
        if current_user.employee is not None:
            serializer = EmployeeSerializer(current_user.employee, context={'request': request})
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def team_lead_employees(request):
    current_user = request.user
    lead_id = request.QUERY_PARAMS.get('lead_id', 0)
    if lead_id==0:
        lead = Employee.objects.get(user=current_user)
        lead_id = lead.id
    else:
        lead = Employee.objects.get(id=lead_id)
    if lead.user == current_user or current_user.is_superuser:
        leaderships = Leadership.objects.filter(leader__id=int(lead_id))
        leaderships = leaderships.filter(end_date__isnull=True)
        employees = []
        for leadership in leaderships:
            if leadership.employee not in employees:
                if leadership.employee.departure_date is None:
                    employees.append(leadership.employee)

        serializer = EmployeeSerializer(employees, many=True, context={'request': request})

        return Response(serializer.data)
    else:
        return Response(None, status=status.HTTP_403_FORBIDDEN)

def show_org_chart(request):
    return render_to_response("org_chart.html",
                          {'nodes':Employee.objects.all()},
                          context_instance=RequestContext(request))