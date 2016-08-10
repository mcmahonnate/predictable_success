from comp.api.views import add_salary_to_employee
from dateutil import parser
from org.api.permissions import *
from org.api.serializers import SanitizedEmployeeSerializer, UserSerializer, EmployeeSerializer, TeamSerializer, LeadershipSerializer, AttributeSerializer, MinimalEmployeeSerializer, EditEmployeeSerializer, CreateEmployeeSerializer
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .serializers import *


def parseBoolString(theString):
    return theString[0].upper() == 'T'


class UserList(generics.ListAPIView):
    serializer_class = SanitizedEmployeeSerializer
    queryset = Employee.objects.get_current_employees(show_hidden=True)
    queryset = queryset.exclude(user__isnull=True).filter(user__is_active=True)
    permission_classes = (IsAuthenticated,)


class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TeamSerializer
    queryset = Team.objects.all()


class LeadershipsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeadershipSerializer
    queryset = Leadership.objects.all()

    def get_queryset(self):
        employee_id = self.request.QUERY_PARAMS.get('employee_id', None)
        leader_id = self.request.QUERY_PARAMS.get('leader_id', None)
        if employee_id is not None:
            self.queryset = self.queryset.filter(employee__id=employee_id)
        if leader_id is not None:
            self.queryset = self.queryset.filter(leader__id=leader_id)

        return self.queryset


class AttributeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AttributeSerializer
    queryset = Attribute.objects.all()

    def get_queryset(self):
        employee_id = self.request.QUERY_PARAMS.get('employee_id', None)
        category_id = self.request.QUERY_PARAMS.get('category_id', None)
        display = self.request.QUERY_PARAMS.get('display', None)
        if employee_id is not None:
            self.queryset = self.queryset.filter(employee__id=employee_id)
        if category_id is not None:
            self.queryset = self.queryset.filter(category__id=category_id)
        if display is not None:
            self.queryset = self.queryset.filter(category__display=display)
            
        return self.queryset


@api_view(['GET'])
def comment_report_timespan(request):
    start_date = parser.parse(request.QUERY_PARAMS.get('start_date', None)).date()
    end_date = parser.parse(request.QUERY_PARAMS.get('end_date', None)).date()

    response_data = {}
    comments = Comment.objects.filter(created_date__range=[start_date, end_date])
    response_data['total'] = len(comments)
    response_data['by_user'] = {}

    for comment in comments:
        try:
            user = comment.owner.username if comment.owner else None
            if user in response_data['by_user']:
                response_data['by_user'][user] += 1
            else:
                response_data['by_user'][user] = 1
        except User.DoesNotExist:
            pass

    return Response(response_data)


@api_view(['GET'])
def last_activity_report(request):
    employees = Employee.objects.get_current_employees();
    response_data = [];
    for employee in employees:
        res = {}
        res['full_name'] = employee.full_name
        res['email'] = employee.email
        res['last_comment'] = "None"
        res['last_checkin'] = "None"

        requester = Employee.objects.get(user__id=request.user.id)
        comments = Comment.objects.get_comments_for_employee(requester=requester,employee=employee)
        if comments:
            last_comment = comments.order_by('-created_date')[0]
            res['last_comment'] = last_comment.created_date.date()

        checkins = employee.checkins.all()
        if checkins:
            last_checkin = checkins.order_by('-date')[0]
            res['last_checkin'] = last_checkin.date.date()

        response_data.append(res)
    return Response(response_data)


@api_view(['POST'])
def upload_employee(request):
    team_id = -1
    if 'team' in request.DATA:
        team_name = request.DATA['team']
        try:
            team = Team.objects.get(name=team_name)
            team_id = team.id
        except Team.DoesNotExist:
            team = Team(name=team_name)
            team.save()
            team_id = team.id
    request.DATA['team'] = team_id

    if 'hire_date' in request.DATA:
        date_string = request.DATA['hire_date']
        request.DATA['hire_date'] = parser.parse(date_string).date()

    if 'id' in request.DATA:
        id = request.DATA['id']
        employee = Employee.objects.get(id=id)

    else:
        serializer = CreateEmployeeSerializer(data = request.DATA, context={'request':request})
        if serializer.is_valid():
            employee = serializer.save()
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=400)
    add_salary_to_employee(employee, request.DATA)
    serializer = EmployeeSerializer(employee, context={'request':request})
    return Response(serializer.data)


@api_view(['POST'])
def upload_leadership(request):
    response_item = {}
    leader_full_name = request.DATA['team_leader']
    employee = Employee.objects.get(id=request.DATA['id'])
    try:
        leader = Employee.objects.get(full_name=leader_full_name)
        leadership = Leadership(employee=employee,leader=leader)
        leadership.save()
        employee.current_leader(leader.id)
    except Employee.DoesNotExist:
        leaders = Employee.objects.filter(last_name__in=leader_full_name.split(" ")).values('full_name')
        if not leaders:
            leaders = []
        response_item['Incorrect Field'] = 'Team Leader'
        response_item['Leader Suggestions'] = list(leaders)
    return response_item


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 100
    def get_paginated_response(self, data):
        return Response({'count': self.page.paginator.count,
                         'has_next': self.page.has_next(),
                         'page' : self.page.number,
                         'results': data})


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 16
    page_size_query_param = 'page_size'
    max_page_size = 100
    def get_paginated_response(self, data):
        return Response({'count': self.page.paginator.count,
                         'has_next': self.page.has_next(),
                         'page' : self.page.number,
                         'results': data})


@api_view(['POST'])
def upload_teams(request):
    response_data = []
    teams = request.DATA['teams']
    trim_teams = set(teams)
    for trim_team in trim_teams:
        team = None
        try:
            team = Team.objects.get(name=trim_team)
        except Team.DoesNotExist:
            team = Team(name=trim_team)
            team.save()
        serializer = TeamSerializer(team, context={'request': request})
        response_data.append(serializer.data)
    return Response(response_data)


class ImageUploadView(APIView):
    parser_classes = (MultiPartParser,FormParser)

    def post(self, request, pk, format=None):
        employee = Employee.objects.get(id=pk)
        image_obj = request.FILES['file0']
        print 'uploading'
        employee.upload_avatar(file=image_obj, mime_type=image_obj.content_type)
        serializer = MinimalEmployeeSerializer(employee, context={'request': request})
        return Response(serializer.data)


@api_view(['GET'])
def user_status(request):
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)


def add_current_employee_to_request(request, field_name):
    employee = Employee.objects.get_from_user(request.user)
    has_multiple_items = isinstance(request.DATA, list)
    if has_multiple_items:
        for item in request.DATA:
            item[field_name] = employee.id
    else:
        request.DATA[field_name] = employee.id

