from assessment.api.serializers import AssessmentSerializer, MBTIReportSerializer, MBTISerializer
from assessment.models import EmployeeAssessment, MBTI
from blah.commentreports import get_employees_with_comments
from checkins.models import CheckIn
from comp.api.views import add_salary_to_employee
from customers.api.serializers import CustomerSerializer
from datetime import date, timedelta
from dateutil import parser
from django.core.mail import send_mail, EmailMultiAlternatives
from django.core.signing import Signer
from django.http import Http404, HttpResponse
from django.template.loader import get_template
from django.template import Context
from engagement.api.serializers import SurveyUrlSerializer, HappinessSerializer
from engagement.engagementreports import get_employees_with_happiness_scores
from engagement.models import Happiness, SurveyUrl, generate_survey
from insights.api.serializers import ProspectSerializer
from insights.models import Prospect
from json import dumps
from kpi.api.serializers import KPIIndicatorSerializer, KPIPerformanceSerializer
from kpi.models import Performance, Indicator
from org.api.permissions import *
from org.api.serializers import SanitizedEmployeeSerializer, UserSerializer, EmployeeSerializer, TeamSerializer, LeadershipSerializer, AttributeSerializer, MinimalEmployeeSerializer, EditEmployeeSerializer, CreateEmployeeSerializer
from org.teamreports import get_mbti_report_for_team
from pvp.api.serializers import TalentCategoryReportSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from .serializers import *
from todo.api.serializers import TaskSerializer, CreateTaskSerializer, EditTaskSerializer
from todo.models import Task


logger = getLogger('talentdashboard')


def parseBoolString(theString):
    return theString[0].upper() == 'T'


class UserList(generics.ListAPIView):
    serializer_class = SanitizedEmployeeSerializer
    queryset = Employee.objects.get_current_employees(show_hidden=True)
    queryset = queryset.exclude(user__isnull=True).filter(user__is_active=True)
    permission_classes = (IsAuthenticated,)


class CoachList(generics.ListAPIView):
    serializer_class = SanitizedEmployeeSerializer
    queryset = Employee.objects.get_current_employees(show_hidden=True)


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
@permission_classes((IsAuthenticated,))
def all_employee_comment_report(request):
        report = None
        days_ago = request.QUERY_PARAMS.get('days_ago', None)
        neglected = request.QUERY_PARAMS.get('neglected', None)
        if neglected is not None:
            neglected = parseBoolString(neglected)
        else:
            neglected = False
        if days_ago is None:
            days_ago = 30
        report = get_employees_with_comments(int(days_ago), neglected)
        serializer = TalentCategoryReportSerializer(report, context={'request': request})
        return Response(serializer.data)

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
def task_report_timespan(request):
    start_date = parser.parse(request.QUERY_PARAMS.get('start_date', None)).date()
    end_date = parser.parse(request.QUERY_PARAMS.get('end_date', None)).date()
    
    response_data = {}
    tasks = Task.objects.filter(created_date__range=[start_date, end_date])
    response_data['total'] = len(tasks)
    response_data['by_user'] = {}

    for task in tasks:
        user = task.created_by.user.username
        if user in response_data['by_user']:
            response_data['by_user'][user] += 1
        else:
            response_data['by_user'][user] = 1

    return Response(response_data)

@api_view(['GET'])
def checkin_report_timespan(request):
    start_date = parser.parse(request.QUERY_PARAMS.get('start_date', None)).date()
    end_date = parser.parse(request.QUERY_PARAMS.get('end_date', None)).date()
    
    response_data = {}
    checkins = CheckIn.objects.filter(date__range=[start_date, end_date])
    response_data['total'] = len(checkins)
    response_data['by_user'] = {}

    for checkin in checkins:
        user = checkin.host.user.username if checkin.host.user else None
        if user in response_data['by_user']:
            response_data['by_user'][user] += 1
        else:
            response_data['by_user'][user] = 1

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


class TeamMBTIReportDetail(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, format=None):
        try:
            report = get_mbti_report_for_team(pk)
            serializer = MBTIReportSerializer(report, context={'request': request})
            return Response(serializer.data)
        except:
            return Response(None, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def all_employee_engagement_report(request):
        days_ago = request.QUERY_PARAMS.get('days_ago', None)
        neglected = request.QUERY_PARAMS.get('neglected', None)
        if neglected is not None:
            neglected = parseBoolString(neglected)
        else:
            neglected = False
        if days_ago is None:
            days_ago = 30
        report = get_employees_with_happiness_scores(int(days_ago), neglected)
        serializer = TalentCategoryReportSerializer(report, context={'request': request})
        return Response(serializer.data)


class EmployeeList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        group_name = request.QUERY_PARAMS.get('group_name', None)
        show_hidden = request.QUERY_PARAMS.get('show_hidden', False)
        view_all = request.QUERY_PARAMS.get('view_all', False)
        full_name = request.QUERY_PARAMS.get('full_name', None)

        if not view_all:
            employees = Employee.objects.get_current_employees_employee_has_access_to(request.user.employee)
        else:
            employees = Employee.objects.get_current_employees(show_hidden=show_hidden)

        if group_name:
            employees = Employee.objects.get_current_employees_by_group_name(name=group_name,show_hidden=show_hidden)

        if full_name:
            employees = Employee.objects.filter(full_name=full_name)
            if employees:
                employee = employees[0]
                serializer = SanitizedEmployeeSerializer(employee, context={'request':request})
                return Response(serializer.data)
            else:
                return Response({'leader': 'field error'}, status=400)
        serializer = SanitizedEmployeeSerializer(employees, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, format=None):
        if 'hire_date' in request.DATA and request.DATA['hire_date'] is not None:
            date_string = request.DATA['hire_date']
            request.DATA['hire_date'] = parser.parse(date_string).date()

        serializer = CreateEmployeeSerializer(data=request.DATA, context={'request': request})
        if serializer.is_valid():
            employee = serializer.save()
            add_salary_to_employee(employee, request.DATA)
            serializer = EmployeeSerializer(employee, context={'request':request})
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def put(self, request, format=None):
        employee = Employee.objects.get(id=pk)
        
        if employee is not None:
            employee.first_name = request.DATA["_first_name"]
            employee.last_name = request.DATA["_last_name"]
            employee.email = request.DATA["_email"]
            if request.DATA["_hire_date"] is not None:
                employee.hire_date = parser.parse(request.DATA["_hire_date"])
            else:
                employee.hire_date = None
            if request.DATA["_departure_date"] is not None:
                employee.departure_date = parser.parse(request.DATA["_departure_date"])
            else:
                employee.departure_date = None
            if request.DATA["_team_id"] is not None:
                team_id = request.DATA["_team_id"]
                employee.team = Team.objects.get(id=team_id)
            else:
                employee.team = None
            if request.DATA["_coach_id"] is not None:
                coach_id = request.DATA["_coach_id"]
                employee.coach = Employee.objects.get(id=coach_id)
            else:
                employee.coach = None
            if request.DATA["_leader_id"] is not None:
                leader_id = request.DATA["_leader_id"]
                employee.current_leader = Employee.objects.get(id=leader_id)
            else:
                employee.current_leader = None
            employee.save()
            serializer = EmployeeSerializer(employee, many=False, context={'request': request})
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)


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


class EmployeeNames(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        employees = Employee.objects.get_current_employees()
        employees = employees.values_list('full_name',flat=True)
        employees_list = list(employees)
        return HttpResponse(dumps(employees_list), content_type='application/json')


class SendEngagementSurvey(APIView):
    def post(self, request, pk, format=None):
        override = False
        employee = Employee.objects.get(id=pk)
        sent_from_id = request.DATA["_sent_from_id"]
        subject = request.DATA["_subject"]
        body = request.DATA["_body"]
        if "_override" in request.DATA:
            override = request.DATA["_override"]
        sent_from = Employee.objects.get(id=sent_from_id)
        current_surveys = SurveyUrl.objects.filter(sent_to__id=pk, active=True)
        if len(current_surveys) > 0 and not override:
            serializer = SurveyUrlSerializer(current_surveys, many=True, context={'request': request})
            return Response(serializer.data)
        elif current_surveys:
            current_surveys.update(active=False)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        elif not employee.email:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        if employee.user is None:
            try:
                user = User.objects.get(email=employee.email)
            except User.DoesNotExist:
                password = User.objects.make_random_password()
                user = User.objects.create_user(employee.email, employee.email, password)
                user.is_active = False
                user.save()
            employee.user = user
            employee.save()
        survey = generate_survey(employee, sent_from, request.tenant)
        html_template = get_template('engagement_survey_email.html')
        template_vars = Context({'employee_name': employee.first_name, 'body': body, 'survey_url': survey.url, 'from': survey.sent_from.full_name})
        html_content = html_template.render(template_vars)
        subject = subject
        text_content = 'Fill out this survey:\r\n' + survey.url
        mail_from = survey.sent_from.full_name + ' <notify@dfrntlabs.com>'
        mail_to = employee.email
        msg = EmailMultiAlternatives(subject, text_content, mail_from, [mail_to])
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return Response(None)

class EngagementSurvey(APIView):
    permission_classes = (AllowAny,)
    def get(self, request, pk, sid, format=None):
        try:
            signer = Signer()
            survey_id = signer.unsign(sid)
            employee_id = signer.unsign(pk)
            survey = SurveyUrl.objects.get(id=survey_id)
            serializer = SurveyUrlSerializer(survey, many=False, context={'request': request})
            return Response(serializer.data)
        except:
            return Response(None, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk, sid, format=None):
        assessment = request.DATA["_assessment"]
        signer = Signer()
        survey_id = signer.unsign(sid)
        survey = SurveyUrl.objects.get(id=survey_id)

        employee = survey.sent_to
        visibility = 3
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        happy = Happiness()
        happy.employee = employee
        happy.assessed_by = employee
        happy.assessment = int(assessment)
        if "_content" in request.DATA:
            content = request.DATA["_content"]
            comment = employee.comments.add_comment(content=content, visibility=visibility, daily_digest=True, owner=employee.user)
            happy.comment = comment
        happy.save()
        survey.completed = True
        survey.active = False
        survey.save()
        serializer = SurveyUrlSerializer(survey, many=False, context={'request': request})
        return Response(serializer.data)


class EmployeeEngagement(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id=pk)
        if not employee.is_viewable_by_user(request.user):
            raise PermissionDenied
        current = request.QUERY_PARAMS.get('current', None)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        if current is not None:
            current = parseBoolString(current)
        happys = Happiness.objects.filter(employee__id=pk)
        if current:
            try:
                happy = happys.latest('assessed_date')
                serializer = HappinessSerializer(happy, many=False, context={'request': request})
                return Response(serializer.data)
            except:
                return Response(None)
        else:
            happys = happys.extra(order_by=['-assessed_date'])
            serializer = HappinessSerializer(happys, many=True, context={'request': request})
            return Response(serializer.data)

    def post(self, request, pk, format=None):
        employee = Employee.objects.get(id=pk)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        assessed_by_id = request.DATA["_assessed_by_id"]
        assessed_by = Employee.objects.get(id=assessed_by_id)
        if assessed_by is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        assessment = request.DATA["_assessment"]
        happy = Happiness()
        happy.employee = employee
        happy.assessed_by = assessed_by
        happy.assessment = int(assessment)
        if "_include_in_daily_digest" in request.DATA:
            daily_digest = request.DATA["_include_in_daily_digest"]
        else:
            daily_digest = True
        if "_content" in request.DATA:
            content = request.DATA["_content"]
            visibility = 3
            comment = employee.comments.add_comment(content, visibility, daily_digest, assessed_by.user)
            happy.comment = comment
        happy.save()
        serializer = HappinessSerializer(happy, many=False, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        assessment_id = request.DATA["_assessment_id"]
        assessment = request.DATA["_assessment"]
        happy = Happiness.objects.get(id=assessment_id)
        if happy is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        happy.assessment = int(assessment)
        happy.save()
        serializer = HappinessSerializer(happy, many=False, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        happy = Happiness.objects.filter(id=pk)
        if happy is not None:
            happy.delete()
            return Response(None)
        return Response(None, status=status.HTTP_404_NOT_FOUND)


class Assessment(APIView):
    permission_classes = (IsAuthenticated, PermissionsViewThisEmployee)

    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id=pk)
        category = request.QUERY_PARAMS.get('category', None)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        if not employee.is_viewable_by_user(request.user):
            raise PermissionDenied
        assessments = EmployeeAssessment.objects.filter(employee__id=pk)
        if category is not None:
            assessments = assessments.filter(category__name=category)
        serializer = AssessmentSerializer(assessments, many=True, context={'request': request})
        return Response(serializer.data)


class EmployeeMBTI(APIView):
    permission_classes = (IsAuthenticated, PermissionsViewThisEmployee)

    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id=pk)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        if not employee.is_viewable_by_user(request.user):
            raise PermissionDenied
        try:
            mbti = MBTI.objects.filter(employee__id=pk)[0]
            if mbti is None:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
            serializer = MBTISerializer(mbti, many=False, context={'request': request})
            return Response(serializer.data)
        except:
            return Response(None)


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

class LeadershipDetail(APIView):
    permission_classes = (IsAuthenticated,)
    model = Leadership

    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id=pk)
        if employee is not None:
            try:
                leaderships = Leadership.objects.filter(employee__id=employee.id)
                leadership = leaderships.latest('start_date')
                serializer = LeadershipSerializer(leadership, many=False, context={'request': request})
                return Response(serializer.data)
            except Leadership.DoesNotExist:
                pass
        return Response(None, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk, format=None):
        employee = Employee.objects.get(id=pk)
        leader_id = request.DATA["leader_id"]
        leader = Employee.objects.get(id = leader_id)
        leadership = Leadership()
        leadership.employee = employee
        leadership.leader = leader
        leadership.save()
        serializer = LeadershipSerializer(leadership, many=False, context={'request': request})
        return Response(serializer.data)


class MyTaskList(APIView):
    def get(self, request, format=None):
        assigned_to = Employee.objects.get(user__id=request.user.id)
        if assigned_to is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        completed = request.QUERY_PARAMS.get('completed', None)
        if completed is None:
            completed = False
        else:
            completed = parseBoolString(completed)
        tasks = Task.objects.filter(assigned_to__id=assigned_to.id)
        tasks = tasks.filter(completed=completed)
        tasks = tasks.extra(order_by=['-due_date'])
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(tasks, request)
        serializer = TaskSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class TaskDetail(APIView):
    permission_classes = (IsAuthenticated,)

    def get_current_employee(self, request):
        return Employee.objects.get_from_user(request.user)

    def get_object(self, pk):
        try:
            return Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            raise Http404

    def get(self, request, pk=None):
        if pk is None:
            tasks = Task.objects
            if 'filter' in request.QUERY_PARAMS:
                value = request.QUERY_PARAMS.get('filter')
                if value == 'mine':
                    current_employee = self.get_current_employee(request)
                    tasks = tasks.filter(assigned_to=current_employee)
            if 'completed' in request.QUERY_PARAMS:
                completed = request.QUERY_PARAMS.get('completed', '').lower() == 'true'
                tasks = tasks.filter(completed=completed)
            if 'employee_id' in request.QUERY_PARAMS:
                employee_id = request.QUERY_PARAMS.get('employee_id')
                employee = Employee.objects.get(pk=employee_id)
                if not employee.is_viewable_by_user(request.user):
                    raise PermissionDenied

                tasks = tasks.filter(employee_id=employee_id)
            tasks = tasks.extra(order_by=['-due_date'])
            paginator = StandardResultsSetPagination()
            result_page = paginator.paginate_queryset(tasks.all(), request)
            serializer = TaskSerializer(result_page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        else:
            task = self.get_object(pk)
            serializer = TaskSerializer(task)
            return Response(serializer.data)

    def post(self, request):
        add_current_employee_to_request(request, 'created_by')
        serializer = CreateTaskSerializer(data=request.DATA)

        if serializer.is_valid():
            task = serializer.save()
            if task.assigned_to is not None:
                task.assigned_by = self.get_current_employee(request)
                task.save()
                self.notify(request, task)
            serializer = TaskSerializer(task)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def put(self, request, pk):
        notify = False
        task = self.get_object(pk)
        current_assigned_to = task.assigned_to
        serializer = EditTaskSerializer(data=request.DATA)

        if serializer.is_valid():
            task = serializer.update(task, serializer.validated_data)
            if current_assigned_to is None and task.assigned_to is not None:
                notify = True
            elif task.assigned_to is not None and task.assigned_to != current_assigned_to:
                notify = True

            if notify:
                self.notify(request, task)
            serializer = TaskSerializer(task)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def delete(self, request, pk, format=None):
        task = Task.objects.filter(id=pk)
        if task is not None:
            task.delete()
            return Response(None)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

    def notify(self, request, task):
            description_summary = task.description.replace('\n', ' ').replace('\r', '')
            description_summary = (description_summary[:25] + '...') if len(description_summary) > 25 else description_summary
            subject = '(' + task.employee.full_name + ') To-do assigned to you: ' + description_summary
            message = task.assigned_by.full_name + ' just assigned this to you: \r\n' + task.description + '\r\n http://' + request.tenant.domain_url + '/#/employees/' + str(task.employee.id)
            mail_from = task.assigned_by.full_name + '<notify@dfrntlabs.com>'
            send_mail(subject, message, mail_from, [task.assigned_to.user.email], fail_silently=False)


class EmployeeTaskList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, format=None):
        if(pk == 'all-employees'):
            employee = Employee.objects.get(user__id=request.user.id)
            days_ahead = request.QUERY_PARAMS.get('days_ahead', None)
            if days_ahead is None:
                days_ahead = 7
            d = date.today()+timedelta(days=int(days_ahead))
            tasks = Task.objects.filter(completed=False).filter(Q(due_date__lt=d) | Q(due_date__isnull=True))
            tasks = tasks.exclude(employee=employee)
        else:
            employee = Employee.objects.get(id=pk)
            if employee is None:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
            completed = request.QUERY_PARAMS.get('completed', None)
            if completed is None:
                completed = False
            else:
                completed = parseBoolString(completed)
            tasks = Task.objects.filter(employee__id=pk)
            tasks = tasks.filter(completed=completed)
            tasks = tasks.extra(order_by=['-created_date'])

        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(tasks, request)
        serializer = TaskSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, pk, format=None):
        employee_id = request.DATA["_employee_id"]
        employee = Employee.objects.get(id=employee_id)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        owner_id = request.DATA["_owner_id"]
        owner = Employee.objects.get(user__id=owner_id)
        if owner is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        assigned_to_id = request.DATA["_assigned_to_id"]
        description = request.DATA["_description"]
        due_date = request.DATA["_due_date"]
        task = Task()
        task.employee = employee
        task.created_by = owner
        if assigned_to_id is not None:
            assigned_to = Employee.objects.get(id=assigned_to_id)
            if assigned_to is not None:
                 task.assigned_to = assigned_to
        if description is not None:
             task.description = description
        if due_date is not None:
            task.due_date = due_date
        task.save()
        serializer = TaskSerializer(task, context={'request': request})
        return Response(serializer.data)


class ProspectList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        try:
            domain = request.QUERY_PARAMS.get('domain', None)
            talent_category = request.QUERY_PARAMS.get('talent_category', None)
            engagement = request.QUERY_PARAMS.get('engagement', None)
            prospects = Prospect.objects.filter(email__contains=domain, team_lead=False)
            if talent_category is not None:
                prospects = prospects.filter(talent_category=talent_category)
            if engagement is not None:
                prospects = prospects.filter(engagement=engagement)
            serializer = ProspectSerializer(prospects, many=True, context={'request': request})
            return Response(serializer.data)
        except Prospect.DoesNotExist:
            return Response(None)


class ProspectDetail(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        try:
            email = request.QUERY_PARAMS.get('email', None)
            prospect = Prospect.objects.filter(email=email,team_lead=False).latest('created_at')
            serializer = ProspectSerializer(prospect,context={'request': request})
            return Response(serializer.data)
        except Prospect.DoesNotExist:
            return Response(None)


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
def coachee_list(request):
    employee = Employee.objects.get(user__id=request.user.id)
    employees = Employee.objects.get_current_employees(show_hidden=True)
    employees = employees.filter(coach__id=employee.id)
    serializer = MinimalEmployeeSerializer(employees, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def user_status(request):
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def customer(request):
    serializer = CustomerSerializer(request.tenant)
    return Response(serializer.data)

@api_view(['GET'])
def current_kpi_indicator(request):
    try:
        indicator = Indicator.objects.all()[0:1].get()
        serializer = KPIIndicatorSerializer(indicator, context={'request': request})
        return Response(serializer.data)
    except Indicator.DoesNotExist:
        return Response(None, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def current_kpi_performance(request):
    try:
        performance = Performance.objects.latest('date')
        serializer = KPIPerformanceSerializer(performance, context={'request': request})
        return Response(serializer.data)
    except Performance.DoesNotExist:
        return Response(None, status=status.HTTP_404_NOT_FOUND)


def add_current_employee_to_request(request, field_name):
    employee = Employee.objects.get_from_user(request.user)
    has_multiple_items = isinstance(request.DATA, list)
    if has_multiple_items:
        for item in request.DATA:
            item[field_name] = employee.id
    else:
        request.DATA[field_name] = employee.id

