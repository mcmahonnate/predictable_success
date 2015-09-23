from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..indexes import EmployeeIndex
from org.models import Employee


@api_view(['GET'])
def employee_search(request):
    return _find_employees(request)


@api_view(['GET'])
def my_team_employee_search(request):
    return _find_employees_filtered_by_current_user_descendants(request)


@api_view(['GET'])
def my_coachees_employee_search(request):
    return _find_employees_filtered_by_relationship_to_current_user(request, 'coach_ids')

def _find_employees_filtered_by_current_user_descendants(request):
    current_employee = Employee.objects.get(user=request.user)
    kwargs = {'tree_id': current_employee.tree_id, 'lft': "[%d TO *]" % current_employee.lft, 'rght': "[* TO %d]" % current_employee.rght, 'pk': current_employee.pk}
    return _find_employees(request, **kwargs)

def _find_employees_filtered_by_relationship_to_current_user(request, relationship_field):
    current_employee = Employee.objects.get(user=request.user)
    kwargs = {relationship_field: [current_employee.id]}
    return _find_employees(request, **kwargs)


def _find_employees(request, **kwargs):
    index = EmployeeIndex()
    filters = {
        'talent_categories': request.QUERY_PARAMS.getlist('talent_category', None),
        'team_ids': request.QUERY_PARAMS.getlist('team_id', None),
        'happiness': request.QUERY_PARAMS.getlist('happiness', None),
        'vops': request.QUERY_PARAMS.get('vops', None),
        'page': 1,
        'rows': 500
    }
    filters.update(kwargs)
    results = index.find_employees(request.tenant, **filters)
    return Response(results)


@api_view(['GET'])
def salary_report(request):
    kwargs = {
        'talent_categories': request.QUERY_PARAMS.getlist('talent_category', None),
        'team_ids': request.QUERY_PARAMS.getlist('team_id', None),
        'happiness': request.QUERY_PARAMS.getlist('happiness', None),
    }
    return _get_salary_report(request, **kwargs)


@api_view(['GET'])
def my_team_salary_report(request):
    return _get_salary_report_filtered_by_current_user_descendants(request)


@api_view(['GET'])
def my_coachees_salary_report(request):
    return _get_salary_report_filtered_by_relationship_to_current_user(request, 'coach_ids')


@api_view(['GET'])
def talent_report(request):
    kwargs = {
        'talent_categories': request.QUERY_PARAMS.getlist('talent_category', None),
        'team_ids': request.QUERY_PARAMS.getlist('team_id', None),
        'happiness': request.QUERY_PARAMS.getlist('happiness', None),
    }
    return _get_talent_report(request, **kwargs)


@api_view(['GET'])
def my_team_talent_report(request):
    return _get_talent_report_filtered_by_current_user_descendants(request)


@api_view(['GET'])
def my_coachees_talent_report(request):
    return _get_talent_report_filtered_by_relationship_to_current_user(request, 'coach_ids')


def _get_salary_report_filtered_by_current_user_descendants(request):
    current_employee = Employee.objects.get(user=request.user)
    kwargs = {'tree_id': current_employee.tree_id, 'lft': "[%d TO *]" % current_employee.lft, 'rght': "[* TO %d]" % current_employee.rght, 'pk': current_employee.pk}

    return _get_salary_report(request, **kwargs)

def _get_salary_report_filtered_by_relationship_to_current_user(request, relationship_field):
    current_employee = Employee.objects.get(user=request.user)
    kwargs = {relationship_field: [current_employee.id]}
    return _get_salary_report(request, **kwargs)


def _get_salary_report(request, **kwargs):
    index = EmployeeIndex()
    report = index.get_salary_report(request.tenant, **kwargs)
    if report is None:
        return Response(None, status=status.HTTP_404_NOT_FOUND)

    return Response(report)


def _get_talent_report_filtered_by_current_user_descendants(request):
    current_employee = Employee.objects.get(user=request.user)
    kwargs = {'tree_id': current_employee.tree_id, 'lft': "[%d TO *]" % current_employee.lft, 'rght': "[* TO %d]" % current_employee.rght, 'pk': current_employee.pk}
    return _get_talent_report(request, **kwargs)


def _get_talent_report_filtered_by_relationship_to_current_user(request, relationship_field):
    current_employee = Employee.objects.get(user=request.user)
    kwargs = {relationship_field: [current_employee.id]}
    return _get_talent_report(request, **kwargs)


def _get_talent_report(request, **kwargs):
    index = EmployeeIndex()
    report = index.get_talent_report(request.tenant, **kwargs)
    if report is None:
        return Response(None, status=status.HTTP_404_NOT_FOUND)

    return Response(report)
