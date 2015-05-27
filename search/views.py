from rest_framework.decorators import api_view
from rest_framework.response import Response
import pysolr


@api_view(['GET'])
def employee_search(request):
    solr = pysolr.Solr("http://localhost:8983/solr/employees/", timeout=10)

    query = {
        'tenant': request.tenant.schema_name,
        'sort': 'full_name asc',
        'rows': 100,
        'fq': []
    }

    talent_category = request.QUERY_PARAMS.get('talent_category', None)
    if talent_category:
        query['fq'].append('talent_category:%s' % talent_category)

    happiness = request.QUERY_PARAMS.get('happiness', None)
    if happiness:
        query['fq'].append('happiness:%s' % happiness)

    team_id = request.QUERY_PARAMS.get('team_id', None)
    if team_id:
        query['fq'].append('team_id:%s' % team_id)

    results = solr.search('*:*', **query)
    return Response(results)
