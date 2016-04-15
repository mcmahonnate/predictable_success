from django.contrib.auth.views import password_reset_confirm, login
from django.core.urlresolvers import reverse
from django.db.models import F
from django.http import Http404
from django.utils.http import urlsafe_base64_decode
from rest_framework.generics import RetrieveAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from django.template import RequestContext
from django.shortcuts import render_to_response
import dateutil.parser
from talentdashboard.views.views import add_salary_to_employee
from .serializers import EmployeeSerializer, CreateEmployeeSerializer, EditEmployeeSerializer, CoachChangeRequestSerializer, SanitizedEmployeeSerializer
from .permissions import *
from ..models import *
from django.utils.log import getLogger


logger = getLogger('talentdashboard')

@permission_classes((IsAuthenticated,))
class EmployeeDetail(APIView):
    def get(self, request, pk, format=None):
        try:
            employee = Employee.objects.get(id=pk)
            if not employee.is_viewable_by_user(request.user):
                raise PermissionDenied
            if request.user.employee == employee:
                serializer = SanitizedEmployeeSerializer(employee,context={'request': request})
            else:
                serializer = EmployeeSerializer(employee,context={'request': request})
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(None)

    def post(self, request, pk, format=None):
        employee = None
        if 'id' in request.DATA and request.DATA['id'] != 0:
            id = request.DATA['id']
            employee = Employee.objects.get(id=id)
        else:
            serializer = CreateEmployeeSerializer(data = request.DATA, context={'request':request})
            if serializer.is_valid():
                employee = serializer.save()
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=400)
        if 'hire_date' in request.DATA and request.DATA['hire_date'] is not None:
            date_string = request.DATA['hire_date']
            request.DATA['hire_date'] = dateutil.parser.parse(date_string).date()
        if 'departure_date' in request.DATA and request.DATA['departure_date'] is not None:
            date_string = request.DATA['departure_date']
            request.DATA['departure_date'] = dateutil.parser.parse(date_string).date()
        if 'leader_id' in request.DATA and request.DATA['leader_id'] is not None:
            employee.current_leader = Employee.objects.get(id=request.DATA['leader_id'])
            employee.save()
        add_salary_to_employee(employee, request.DATA)
        serializer = EmployeeSerializer(employee, context={'request':request})
        return Response(serializer.data)

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


class Profile(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        current_user = request.user
        if current_user.employee is not None:
            serializer = EmployeeSerializer(current_user.employee, context={'request': request})
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class CurrentCoach(RetrieveAPIView):
    serializer_class = SanitizedEmployeeSerializer

    def get_object(self):
        coach = self.request.user.employee.coach
        if coach is None:
            raise Http404
        return coach

class TeamMemberList(APIView):
    permission_classes = (IsAuthenticated, PermissionsViewAllEmployees)

    def get(self, request, pk, format=None):
        employees = Employee.objects.get_current_employees()
        employees = employees.filter(team__id=pk)

        serializer = EmployeeSerializer(employees, many=True, context={'request': request})
        return Response(serializer.data)

@api_view(['GET'])
def my_team_lead(request):
    current_user = request.user
    employee = Employee.objects.get(user=current_user)
    if employee.user == current_user or current_user.is_superuser:
        lead = employee.leader
        serializer = EmployeeSerializer(lead, many=False, context={'request': request})

        return Response(serializer.data)
    else:
        return Response(None, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
def my_employees(request):
    current_user = request.user
    lead = Employee.objects.get(user=current_user)
    if lead.user == current_user or current_user.is_superuser:
        employees = lead.get_children()
        employees = employees.filter(departure_date__isnull=True)
        serializer = EmployeeSerializer(employees, many=True, context={'request': request})

        return Response(serializer.data)
    else:
        return Response(None, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
def team_lead_employees(request, pk):
    current_employee = Employee.objects.get(user=request.user)
    lead = Employee.objects.get(id=pk)

    if current_employee.is_ancestor_of(other=lead, include_self=True):
        employees = lead.get_children()
        employees = employees.filter(departure_date__isnull=True)
        serializer = EmployeeSerializer(employees, many=True, context={'request': request})

        return Response(serializer.data)
    else:
        return Response(None, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def all_access_employees(request):
    employees = Employee.objects.get_all_access_employees()
    serializer = SanitizedEmployeeSerializer(employees, many=True, context={'request': request})

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((IsAuthenticated, PermissionsViewAllEmployees))
def team_leads(request, pk):
    leaders = Leadership.objects.filter(leader__team_id=pk).values('leader_id')
    employees = Employee.objects.filter(id__in=leaders, departure_date__isnull=True)
    serializer = EmployeeSerializer(employees, many=True, context={'request': request})

    return Response(serializer.data)

def show_org_chart(request):
    return render_to_response("org_chart.html",
                          {'nodes':Employee.objects.get_current_employees(show_hidden=True)},
                          context_instance=RequestContext(request))

@api_view(['GET'])
def available_coaches(request):
    coaches = [c.employee for c in CoachCapacity.objects.filter(num_coachees__lt=F('max_allowed_coachees'))]
    serializer = SanitizedEmployeeSerializer(coaches, many=True)
    return Response(data=serializer.data)


@api_view(['POST'])
def change_coach(request):
    serializer = CoachChangeRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    coach = serializer.validated_data['new_coach']
    try:
        employee = request.user.employee
        employee.update_coach(coach)
        return Response(status=status.HTTP_202_ACCEPTED)
    except CoachCapacity.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)


def account_activate(request, uidb64=None, token=None, template_name=None, set_password_form=None):
    return password_reset_confirm(request, uidb64=uidb64, token=token, template_name=template_name, set_password_form=set_password_form, post_reset_redirect=reverse('account_activate_login', kwargs={'uidb64': uidb64}))

def account_activate_login(request, uidb64=None, template_name=None, authentication_form=None):
    uid = urlsafe_base64_decode(uidb64)
    user = User.objects.get(pk=uid)
    return login(request, template_name=template_name, extra_context={'email': user.email}, authentication_form=authentication_form)
