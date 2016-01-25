from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..indexes import EmployeeIndex
from org.models import Employee
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from org.api.permissions import PermissionsViewThisEmployee


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def employee_search(request):
    return _find_employees(request)

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def employee_leaders_search(request, pk):
    employee = Employee.objects.get(id=pk)
    return _find_employees_filtered_by_employee_ancestors(request, employee)

@api_view(['GET'])
def my_team_employee_search(request):
    current_employee = Employee.objects.get(user=request.user)
    return _find_employees_filtered_by_employee_descendants(request, current_employee)

@api_view(['GET'])
@permission_classes((IsAuthenticated, PermissionsViewThisEmployee))
def lead_employee_search(request, pk):
    lead = Employee.objects.get(id=pk)
    return _find_employees_filtered_by_employee_descendants(request, lead)

@api_view(['GET'])
def my_coachees_employee_search(request):
    return _find_employees_filtered_by_relationship_to_current_user(request, 'coach_ids')

def _find_employees_filtered_by_employee_descendants(request, employee):
    kwargs = {'tree_id': employee.tree_id, 'lft': "[%d TO *]" % employee.lft, 'rght': "[* TO %d]" % employee.rght, 'pk': employee.pk}
    return _find_employees(request, **kwargs)

def _find_employees_filtered_by_employee_ancestors(request, employee):
    kwargs = {'tree_id': employee.tree_id, 'lft': "[* TO %d]" % employee.lft, 'rght': "[%d TO *]" % employee.rght, 'pk': employee.pk}
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
    sanitize = not(request.user.has_perm('org.view_employees'))
    results = index.find_employees(request.tenant, sanitize=sanitize, **filters)
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
    current_employee = Employee.objects.get(user=request.user)
    return _get_salary_report_filtered_by_employee_descendants(request, current_employee)

@api_view(['GET'])
@permission_classes((IsAuthenticated, PermissionsViewThisEmployee))
def lead_salary_report(request, pk):
    lead = Employee.objects.get(id=pk)
    return _get_salary_report_filtered_by_employee_descendants(request, lead)

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
    current_employee = Employee.objects.get(user=request.user)
    return _get_talent_report_filtered_by_employee_descendants(request, current_employee)

@api_view(['GET'])
@permission_classes((IsAuthenticated, PermissionsViewThisEmployee))
def lead_talent_report(request, pk):
    lead = Employee.objects.get(id=pk)
    return _get_talent_report_filtered_by_employee_descendants(request, lead)

@api_view(['GET'])
def my_coachees_talent_report(request):
    return _get_talent_report_filtered_by_relationship_to_current_user(request, 'coach_ids')


def _get_salary_report_filtered_by_employee_descendants(request, employee):
    kwargs = {'tree_id': employee.tree_id, 'lft': "[%d TO *]" % employee.lft, 'rght': "[* TO %d]" % employee.rght, 'pk': employee.pk}

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


def _get_talent_report_filtered_by_employee_descendants(request, employee):
    kwargs = {'tree_id': employee.tree_id, 'lft': "[%d TO *]" % employee.lft, 'rght': "[* TO %d]" % employee.rght, 'pk': employee.pk}
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
