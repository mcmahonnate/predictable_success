from comp.models import *
from decimal import Decimal
from re import sub
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from comp.api.serializers import CompensationSummarySerializer


def add_salary_to_employee(employee, data):
    if 'current_salary' in data:
        now = datetime.datetime.now()
        year = int(now.year)
        try:
            comp = CompensationSummary.objects.get(employee_id=employee.id, year=year)
        except CompensationSummary.DoesNotExist:
            comp = CompensationSummary(employee=employee,fiscal_year=year,year=year)
        comp.salary = Decimal(sub(r'[^\d\-.]', '', data['current_salary']))
        comp.save()


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def compensation_summaries(request):
    compensation_summaries = CompensationSummary.objects.all()

    employee_id = request.QUERY_PARAMS.get('employee_id', None)
    if employee_id is not None:
        employee = Employee.objects.get(pk=employee_id)
        if not employee.is_viewable_by_user(request.user):
            raise PermissionDenied

        compensation_summaries = compensation_summaries.filter(employee__id=employee_id)

    most_recent = request.QUERY_PARAMS.get('most_recent', None)
    if most_recent is not None:
        if len(compensation_summaries) > 0:
            most_recent_summary = compensation_summaries[0]
            serializer = CompensationSummarySerializer(most_recent_summary, many=False, context={'request': request})
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)

    serializer = CompensationSummarySerializer(compensation_summaries, many=True, context={'request': request})
    return Response(serializer.data)


class EmployeeCompensationSummaries(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, format=None):
        if not request.tenant.show_individual_comp:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        employee = Employee.objects.get(pk=pk)
        if not employee.is_viewable_by_user(user=request.user, allowCoach=False):
            raise PermissionDenied

        compensation_summaries = CompensationSummary.objects.all()
        compensation_summaries = compensation_summaries.filter(employee__id=int(pk))
        if compensation_summaries is not None:
            serializer = CompensationSummarySerializer(compensation_summaries, many=True, context={'request': request})
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)
