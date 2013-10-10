from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from pvp.models import PvpEvaluation, EvaluationRound
from org.models import Employee, Team, Mentorship
from comp.models import CompensationSummary
from .serializers import PvpEvaluationSerializer, EmployeeSerializer, TeamSerializer, MentorshipSerializer, TalentCategoryReportSerializer, CompensationSummarySerializer
from pvp.talent_categorization import get_most_recent_talent_category_report_for_all_employees, get_most_recent_talent_category_report_for_team

class EmployeeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

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

class TalentCategoryReportDetail(APIView):
    def get(self, request, pk, format=None):
        report = None
        if(pk == 'all-employees'):
            report = get_most_recent_talent_category_report_for_all_employees()
        serializer = TalentCategoryReportSerializer(report)
        if report is not None:
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

class TeamTalentCategoryReportDetail(APIView):
    def get(self, request, pk, format=None):
        report = get_most_recent_talent_category_report_for_team(pk)
        serializer = TalentCategoryReportSerializer(report)
        if report is not None:
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
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
def pvp_evaluations(request):
    evaluations = PvpEvaluation.objects.all()

    current_round = request.QUERY_PARAMS.get('current_round', None)
    if current_round is not None:
        current_round = EvaluationRound.objects.most_recent()
        evaluations = evaluations.filter(evaluation_round__id = current_round.id)

    employee_id = request.QUERY_PARAMS.get('employee_id', None)
    if employee_id is not None:
        evaluations = evaluations.filter(employee__id=int(employee_id))

    # The talent_category query executes the query, so it needs to happen after all other filters
    talent_category = request.QUERY_PARAMS.get('talent_category', None)
    if talent_category is not None:
        evaluations = [item for item in evaluations if item.get_talent_category() == int(talent_category)]

    serializer = PvpEvaluationSerializer(evaluations, many=True)
    return Response(serializer.data)
