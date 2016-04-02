from copy import copy, deepcopy
from collections import defaultdict, OrderedDict
from datetime import timedelta
from dateutil import parser
from django.http import Http404, HttpResponse
from engagement.models import Happiness
from json import dumps
from org.api.permissions import *
from pvp.models import *
from pvp.api.serializers import *
from pvp.talentreports import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from talentdashboard.views.views import LargeResultsSetPagination


@api_view(['GET'])
def pvp_todos(request):
    evaluations = PvpEvaluation.objects.todos_for_user(request.user)
    team_id = request.QUERY_PARAMS.get('team_id', None)
    if team_id is not None:
        evaluations = evaluations.filter(employee__team__id=team_id)
    paginator = LargeResultsSetPagination()
    result_page = paginator.paginate_queryset(evaluations, request)
    serializer = PvpToDoSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def pvp_descriptions(request):
    descriptions = PvpDescription.objects.all()
    serializer = PvpDescriptionSerializer(descriptions, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes((IsAuthenticated, PermissionsViewAllEmployees))
def pvp_evaluations(request):
    team_id = request.QUERY_PARAMS.get('team_id', None)
    if team_id is not None:
        team_id = int(team_id)
    employees = Employee.objects.get_current_employees(team_id)

    serializer = PvPEmployeeSerializer(employees, many=True, context={'request': request})
    return Response(serializer.data)


class EmployeePvPEvaluations(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, format=None):
        employee = Employee.objects.get(pk=pk)
        if not employee.is_viewable_by_user(request.user):
            raise PermissionDenied

        evaluations = PvpEvaluation.objects.get_evaluations_for_employee(int(pk))
        if evaluations is not None:
            serializer = PvpEvaluationSerializer(evaluations, many=True, context={'request': request})
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)


class PvpEvaluationDetail(APIView):
    def get_object(self, pk):
        try:
            return PvpEvaluation.objects.get(pk=pk)
        except PvpEvaluation.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        pvp = self.get_object(pk)

        if not pvp.employee.is_viewable_by_user(request.user):
            raise PermissionDenied

        serializer = PvpEvaluationSerializer(pvp, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        pvp_id = request.DATA["id"]
        pvp = PvpEvaluation.objects.get(id=pvp_id)
        pvp.performance = request.DATA["_performance"]
        pvp.potential = request.DATA["_potential"]
        pvp.evaluator = request.user
        if "_content" in request.DATA:
            content = request.DATA["_content"]
            if pvp.comment is None:
                visibility = 3
                include_in_daily_digest = True
                comment = pvp.employee.comments.add_comment(content, visibility, include_in_daily_digest, pvp.evaluator)
                pvp.comment = comment
            else:
                pvp.comment.content = content
                pvp.comment.save()
        pvp.save()
        serializer = PvpEvaluationSerializer(pvp,context={'request': request})
        return Response(serializer.data)


class AnnotationChartData(APIView):
    def get(self, request, pk, format=None):
        chart_data = defaultdict(list)
        eval_rounds = EvaluationRound.objects.get_rounds_for_employee(pk)
        for index, this_round in enumerate(eval_rounds):
            if index < len(eval_rounds)-1:
                next_round = eval_rounds[index+1]
                dt = next_round.date - this_round.date
                days = dt.days
                this_eval = PvpEvaluation.objects.get(employee__id=int(pk), evaluation_round__id=this_round.id)
                next_eval = PvpEvaluation.objects.get(employee__id=int(pk), evaluation_round__id=next_round.id)
                performance_step = (next_eval.performance - this_eval.performance) / float(days)
                potential_step = (next_eval.potential - this_eval.potential) / float(days)
                for i in range(0, days):
                    dt = timedelta(days=i)
                    key = this_round.date + dt
                    performance = this_eval.performance + (performance_step*i)
                    potential = this_eval.potential + (potential_step*i)
                    chart_data[key.strftime('%Y-%m-%d')].extend([key.strftime('%Y-%m-%d'),performance, None, None, potential, None, None])
            else:
                dt = datetime.date.today() - this_round.date
                days = dt.days
                for i in range(0, days):
                    dt = timedelta(days=i)
                    key = this_round.date + dt
                    chart_data[key.strftime('%Y-%m-%d')].extend([key.strftime('%Y-%m-%d'),this_eval.performance, None, None, this_eval.potential, None, None])
        employee_type = ContentType.objects.get(model='employee')
        comments = Comment.objects.filter(content_type=employee_type)
        comments = comments.filter(object_id=pk)
        comments = comments.exclude(~Q(owner_id=request.user.id),content_type=employee_type,visibility=1)
        happys = Happiness.objects.filter(employee__id=pk)

        iterate_chart_data = deepcopy(chart_data)
        for key in iterate_chart_data:
            date_parsed = parser.parse(key)
            comment = comments.filter(created_date__year=date_parsed.year,created_date__month=date_parsed.month,created_date__day=date_parsed.day).first()
            if comment:
                chart_data[key].extend([0, None, comment.content])
            else:
                chart_data[key].extend([0, None, None])
            last_happy = copy(happy)
            happy = happys.filter(assessed_date=date_parsed).first()
            if happy:
                chart_data[key].extend([happy.assessment, None, None])
            else:
                chart_data[key].extend([0, None, None])

        chart_data = OrderedDict(sorted(chart_data.items()))

        return HttpResponse(dumps(chart_data), content_type='application/json')