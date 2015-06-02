from rest_framework.decorators import api_view
from rest_framework.response import Response
from indexes import EmployeeIndex

@api_view(['GET'])
def employee_search(request):
    index = EmployeeIndex()
    results = index.find_employees(
        request.tenant,
        talent_categories=request.QUERY_PARAMS.getlist('talent_category', None),
        team_ids=request.QUERY_PARAMS.getlist('team_id', None),
        happiness=request.QUERY_PARAMS.getlist('happiness', None)
    )
    return Response(results)


@api_view(['GET'])
def talent_report(request):
    index = EmployeeIndex()
    results = index.get_talent_report(
        request.tenant,
        talent_categories=request.QUERY_PARAMS.getlist('talent_category', None),
        team_ids=request.QUERY_PARAMS.getlist('team_id', None),
        happiness=request.QUERY_PARAMS.getlist('happiness', None),
        leader_ids=request.QUERY_PARAMS.getlist('leader_id', None),
        coach_ids=request.QUERY_PARAMS.getlist('coach_id', None),
    )
    report = {
        'count': results['count'],
        'total_salaries': results['sum'],
        'categories': {},
    }

    for key in results['facets']['talent_category']:
        category = results['facets']['talent_category'][key]

        value = {
            'count': category['count'],
            'salaries': category['sum']
        }
        report['categories'][key] = value

    return Response(report)
