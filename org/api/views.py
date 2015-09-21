from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from blah.api.serializers import CommentSerializer
from blah.api.views import CommentList
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from django.template import RequestContext
from django.shortcuts import render_to_response
import dateutil.parser
from talentdashboard.views.views import add_salary_to_employee
from .serializers import EmployeeSerializer, CreateEmployeeSerializer, EditEmployeeSerializer
from ..models import Employee, Leadership


class EmployeeDetail(APIView):
    def get(self, request, pk, format=None):
        try:
            employee = Employee.objects.get(id=pk)
            if not employee.is_viewable_by_user(request.user):
                raise PermissionDenied

            serializer = EmployeeSerializer(employee,context={'request': request})
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(None)

    def post(self, request, pk, format=None):

        if 'hire_date' in request.DATA and request.DATA['hire_date'] is not None:
            date_string = request.DATA['hire_date']
            request.DATA['hire_date'] = dateutil.parser.parse(date_string).date()
        if 'departure_date' in request.DATA and request.DATA['departure_date'] is not None:
            date_string = request.DATA['departure_date']
            request.DATA['departure_date'] = dateutil.parser.parse(date_string).date()

        serializer = CreateEmployeeSerializer(data = request.DATA, context={'request':request})
        if serializer.is_valid():
            employee = serializer.save()
            if 'leader_id' in request.DATA and request.DATA['leader_id'] is not None:
                employee.current_leader = Employee.objects.get(id=request.DATA['leader_id'])
                employee.save()
            add_salary_to_employee(employee, request.DATA)
            serializer = EmployeeSerializer(employee, context={'request':request})
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)


    def put(self, request, pk, format=None):
        employee = Employee.objects.get(id=pk)

        if 'hire_date' in request.DATA and request.DATA['hire_date'] is not None:
            date_string = request.DATA['hire_date']
            request.DATA['hire_date'] = dateutil.parser.parse(date_string).date()
        if 'departure_date' in request.DATA and request.DATA['departure_date'] is not None:
            date_string = request.DATA['departure_date']
            request.DATA['departure_date'] = dateutil.parser.parse(date_string).date()

        # by name (for upload)
        if 'team_leader' in request.DATA:
            leader = Employee.objects.get(id=request.DATA['team_leader']['id'])
            employee.current_leader = leader
            employee.save()
            serializer = EmployeeSerializer(employee, context={'request':request})
            return Response(serializer.data)

        # by id
        if 'leader_id' in request.DATA:
            if request.DATA['leader_id']:
                leader = Employee.objects.get(id=request.DATA['leader_id'])
                employee.current_leader = leader
                employee.save()

        serializer = EditEmployeeSerializer(employee, request.DATA, context={'request':request})
        if serializer.is_valid():
            serializer.save()
            emp_serializer = EmployeeSerializer(employee, context={'request':request})
            return Response(emp_serializer.data)
        else:
            return Response(serializer.errors, status=400)


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