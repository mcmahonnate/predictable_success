from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .decorators import *
from pvp.talentreports import get_talent_category_report_for_all_employees, get_talent_category_report_for_team
from pvp.salaryreports import get_salary_report_for_team, get_salary_report_for_all_employees
from blah.models import Comment
from todo.models import Task
from engagement.models import Happiness
import datetime
from django.contrib.auth.models import User
from django.utils.log import getLogger
from django.core.mail import send_mail
from django.contrib.sites.models import get_current_site
from django.contrib.contenttypes.models import ContentType

logger = getLogger('talentdashboard')

class EmployeeList(generics.ListAPIView):
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.filter(display='t')

class UserList(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    queryset = queryset.extra(order_by = ['-last_login'])

class CoachList(generics.ListAPIView):
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.filter(user__groups__id=2)
        
class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TeamSerializer
    queryset = Team.objects.all()

class MentorshipViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MentorshipSerializer
    queryset = Mentorship.objects.all()

    def get_queryset(self):
        mentee_id = self.request.QUERY_PARAMS.get('mentee_id', None)
        mentor_id = self.request.QUERY_PARAMS.get('mentor_id', None)
        if mentee_id is not None:
            self.queryset = self.queryset.filter(mentee__id=mentee_id)
        if mentor_id is not None:
            self.queryset = self.queryset.filter(mentor__id=mentor_id)

        return self.queryset
        
class LeadershipViewSet(viewsets.ReadOnlyModelViewSet):
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
        if employee_id is not None:
            self.queryset = self.queryset.filter(employee__id=employee_id)
        if category_id is not None:
            self.queryset = self.queryset.filter(category__id=category_id)            
            
        return self.queryset  
        
class TalentCategoryReportDetail(APIView):
    def get(self, request, pk, format=None):
        report = None
        if(pk == 'all-employees'):
            report = get_talent_category_report_for_all_employees()
        serializer = TalentCategoryReportSerializer(report)
        if report is not None:
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class TeamTalentCategoryReportDetail(APIView):
    def get(self, request, pk, format=None):
        report = get_talent_category_report_for_team(pk)
        serializer = TalentCategoryReportSerializer(report)
        if report is not None:
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class TeamSalaryReportDetail(APIView):
    def get(self, request, pk, format=None):
        report = get_salary_report_for_team(pk)
        serializer = SalaryReportSerializer(report)
        if report is not None:
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class SubCommentList(APIView):
    def get(self, request, pk, format=None):
        comment_type = ContentType.objects.get(model="comment")
        comments = Comment.objects.filter(object_id = pk)
        comments = comments.filter(content_type=comment_type)
        comments = comments.extra(order_by = ['-created_date'])
        serializer = SubCommentSerializer(comments, many=True)
        return Response(serializer.data)

class EmployeeEngagement(APIView):
    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        happys = Happiness.objects.filter(employee__id = pk)
        happys = happys.extra(order_by = ['-assessed_date'])
        serializer = HappinessSerializer(happys, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        assessed_by_id = request.DATA["_assessed_by_id"]
        assessed_by = Employee.objects.get(id = assessed_by_id)
        assessment = request.DATA["_assessment"]
        happy = Happiness()
        happy.employee = employee
        happy.assessed_by = assessed_by
        happy.assessment = assessment
        happy.save()
        serializer = HappinessSerializer(happy)
        return Response(serializer.data)

class EmployeeCommentList(APIView):
    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        user = Employee.objects.get(user__id = request.user.id)
        employee_type = ContentType.objects.get(model="employee")
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        comments = Comment.objects.filter(object_id = pk,content_type=employee_type)
        comments = comments.exclude(object_id=user.id,content_type=employee_type)
        comments = comments.extra(order_by = ['-created_date'])
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        comment_type = ContentType.objects.get(model="comment")
        model_name = request.DATA["_model_name"]
        content_type = ContentType.objects.get(model=model_name)
        object_id = request.DATA["_object_id"]
        employee = Employee.objects.get(id = pk)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        owner = request.user
        content = request.DATA["_content"]
        if content_type == comment_type:
            comment = Comment.objects.get(id = object_id)
            sub_comment = Comment.objects.add_comment(comment,content,owner)
            serializer = SubCommentSerializer(sub_comment, many=False)
            return Response(serializer.data)
        else:
            comment = employee.comments.add_comment(content, owner)
            serializer = CommentSerializer(comment, many=False)
            return Response(serializer.data)

class CommentList(APIView):
    def get(self, request, format=None):
        employee = Employee.objects.get(user__id = request.user.id)
        employee_type = ContentType.objects.get(model='employee')
        comments = Comment.objects.filter(content_type = employee_type)
        comments = comments.exclude(object_id=employee.id)
        comments = comments.extra(order_by = ['-created_date'])[:15]
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

class CommentDetail(APIView):
    def get(self, request, pk, format=None):
        comment = Comment.objects.get(id = pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        comment = Comment.objects.filter(id = pk)
        if comment is not None:
            comment.update(content = request.DATA["_content"], modified_date = datetime.datetime.now())
            serializer = CommentSerializer(comment, many=False)
            return Response(None)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk, format=None):
        comment = Comment.objects.filter(id = pk)
        if comment is not None:
            comment.delete()
            return Response(None)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class MyTaskList(APIView):
    def get(self, request, format=None):
        assigned_to = Employee.objects.get(user__id = request.user.id)
        if assigned_to is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        tasks = Task.objects.filter(assigned_to__id=assigned_to.id)
        tasks = tasks.extra(order_by = ['-due_date'])
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

class TaskDetail(APIView):
    def get(self, request, pk, format=None):
        task = Task.objects.get(id = pk)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        task = Task.objects.get(id=pk)
        notify = False
        if task is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        assigned_to_id = request.DATA["_assigned_to_id"]
        description = request.DATA["_description"]
        due_date = request.DATA["_due_date"]
        completed = request.DATA["_completed"]
        if assigned_to_id is not None:
            assigned_to = Employee.objects.get(id = assigned_to_id)
            assigned_by = Employee.objects.get(user__id = request.user.id)
            if assigned_to is None:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
            else:
                if task.assigned_to is not None:
                    if task.assigned_to.id != assigned_to.id:
                        task.assigned_by = assigned_by
                        notify = True
                else:
                    task.assigned_by = assigned_by
                    notify = True
                task.assigned_to = assigned_to
        else:
            task.assigned_to = None
        if due_date !="":
            task.due_date = due_date
        task.description = description
        task.completed = completed
        task.save()
        if notify:
            subject = '(' + task.employee.full_name + ') To-do assigned to you: ' + task.description
            message = task.assigned_by.full_name + ' just assigned this to you: \r\n' + task.description + '\r\n http://' + get_current_site(request).domain + '/#/employees/' + str(task.employee.id)
            mail_from = task.assigned_by.full_name + '<notify@dfrntlabs.com>'
            send_mail(subject, message, mail_from, [task.assigned_to.user.email], fail_silently=False)

        return Response(None)

    def delete(self, request, pk, format=None):
        task = Task.objects.filter(id = pk)
        if task is not None:
            task.delete()
            return Response(None)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class EmployeeTaskList(APIView):
    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        tasks = Task.objects.filter(employee__id = pk)
        tasks = tasks.extra(order_by = ['-created_date'])
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        employee_id = request.DATA["_employee_id"]
        employee = Employee.objects.get(id = employee_id)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        owner_id = request.DATA["_owner_id"]
        owner = Employee.objects.get(user__id = owner_id)
        if owner is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        assigned_to_id = request.DATA["_assigned_to_id"]
        description = request.DATA["_description"]
        due_date = request.DATA["_due_date"]
        task = Task()
        task.employee = employee
        task.created_by = owner
        if assigned_to_id is not None:
            assigned_to = Employee.objects.get(id = assigned_to_id)
            if assigned_to is not None:
                 task.assigned_to = assigned_to
        if description is not None:
             task.description = description
        if due_date is not None:
            task.due_date = due_date
        task.save()
        serializer = TaskSerializer(task)
        return Response(serializer.data)

class EmployeeDetail(APIView):
    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        if employee is not None:
            full_name = request.DATA["_full_name"]
            employee.full_name = full_name
            employee.save()
            return Response(None)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def user_status(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
    
@api_view(['GET'])
@cache_on_auth(60*15, 'foolsquad')
@group_required('foolsquad')
def get_company_salary_report(request):
    report = get_salary_report_for_all_employees()
    serializer = SalaryReportSerializer(report)
    if report is not None:
        return Response(serializer.data)
    return Response(None, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@cache_on_auth(60*15, 'foolsquad')
@group_required('foolsquad')
def compensation_summaries(request):
    compensation_summaries = CompensationSummary.objects.all()

    employee_id = request.QUERY_PARAMS.get('employee_id', None)
    if employee_id is not None:
        compensation_summaries = compensation_summaries.filter(employee__id=employee_id)

    most_recent = request.QUERY_PARAMS.get('most_recent', None)
    if most_recent is not None:
        if len(compensation_summaries) > 0:
            most_recent_summary = compensation_summaries[0];
            serializer = CompensationSummarySerializer(most_recent_summary, many=False)
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

    serializer = CompensationSummarySerializer(compensation_summaries, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@cache_on_auth(60*15, 'foolsquad')
@group_required('foolsquad')
def pvp_evaluations(request):
    current_round = request.QUERY_PARAMS.get('current_round', None)
    employee_id = request.QUERY_PARAMS.get('employee_id', None)
    team_id = request.QUERY_PARAMS.get('team_id', None)    
    talent_category = request.QUERY_PARAMS.get('talent_category', None)
    evaluations = PvpEvaluation.objects.all()
        
    if current_round is not None:
        current_round = EvaluationRound.objects.most_recent()
        evaluations = evaluations.filter(evaluation_round__id = current_round.id)

    if employee_id is not None:
        evaluations = evaluations.filter(employee__id=int(employee_id))

    if team_id is not None:
        evaluations = evaluations.filter(employee__team_id=int(team_id))

    # The talent_category query executes the query, so it needs to happen after all other filters
    if talent_category is not None:
        evaluations = [item for item in evaluations if item.get_talent_category() == int(talent_category)]

    data= [{'empty':1}]
    if len(evaluations)>0:
        serializer = PvpEvaluationSerializer(evaluations, many=True)
        data = serializer.data

    return Response(data)
    
@api_view(['GET'])
@cache_on_auth(60*15, 'foolsquad')
@group_required('foolsquad')
def team_leads(request):
    team_id = request.QUERY_PARAMS.get('team_id', None)    
    leads = Leadership.objects.filter(leader__team_id=int(team_id))
    current_round = EvaluationRound.objects.most_recent()
    evaluations = PvpEvaluation.objects.filter(employee__team_id=int(team_id))
    evaluations = evaluations.filter(evaluation_round__id = current_round.id)
       
    employees = []
    for lead in leads:
        if lead.leader not in employees:
            employees.append(lead.leader)
            
    evaluations = evaluations.filter(employee__in=employees)            
    serializer = PvpEvaluationSerializer(evaluations, many=True)
    
    return Response(serializer.data)    

@api_view(['GET'])
def team_lead_employees(request):
    current_user = request.user
    lead_id = request.QUERY_PARAMS.get('lead_id', None)    
    lead = Employee.objects.get(id=lead_id)
    if lead.user == current_user or current_user.is_superuser:
        leaderships = Leadership.objects.filter(leader__id=int(lead_id))
        employees = []
        for leadership in leaderships:
            if leadership.employee not in employees:
                employees.append(leadership.employee)
        
        serializer = EmployeeSerializer(employees, many=True)
        
        return Response(serializer.data)        
    else:
        return Response(None, status=status.HTTP_403_FORBIDDEN)
