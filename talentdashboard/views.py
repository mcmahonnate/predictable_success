from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from pvp.models import PvpEvaluation, EvaluationRound
from org.models import Employee, Team, Mentorship, Leadership, Attribute, AttributeCategory
from comp.models import CompensationSummary
from django.views.decorators.cache import cache_page
from .serializers import *
from .decorators import *
from pvp.talentreports import get_talent_category_report_for_all_employees, get_talent_category_report_for_team
from pvp.salaryreports import get_salary_report_for_team, get_salary_report_for_all_employees
from blah.models import Comment
from django.contrib.auth.models import User
import datetime
from django.utils.log import getLogger
from django.core.cache import cache

logger = getLogger('talentdashboard')

class EmployeeList(generics.ListAPIView):
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.filter(display='t')

class EmployeeDetail(generics.RetrieveAPIView):
    queryset = Employee.objects.filter(display='t')
    serializer_class = EmployeeSerializer
    
    def get_object(self):
        pk = self.kwargs.get(self.pk_url_kwarg, None)
        pk = pk.replace("/", "")
        return Employee.objects.get(id=pk)
        
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
        
class EmployeeCommentList(APIView):
    def get(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        comments = Comment.objects.filter(object_id = pk)
        comments = comments.extra(order_by = ['-created_date'])
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        employee = Employee.objects.get(id = pk)
        if employee is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        owner = request.user
        content = request.DATA["_content"]
        comment = employee.comments.add_comment(content, owner)
        serializer = CommentSerializer(comment, many=False)
        return Response(serializer.data)

class CommentDetail(APIView):
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

@api_view(['GET'])
@cache_on_auth(60*15, ['foolsquad'])
@group_required(['foolsquad'])
def get_company_salary_report(request):
    report = get_salary_report_for_all_employees()
    serializer = SalaryReportSerializer(report)
    if report is not None:
        return Response(serializer.data)
    return Response(None, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@cache_on_auth(60*15, ['foolsquad'])
@group_required(['foolsquad'])
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
@cache_on_auth(60*15, ['foolsquad'])
@group_required(['foolsquad'])
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
@cache_on_auth(60*15, ['foolsquad'])
@group_required(['foolsquad'])
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