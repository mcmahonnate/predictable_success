from rest_framework.decorators import api_view
from rest_framework.response import Response
from serializers import *


@api_view(['GET'])
def customer(request):
    serializer = CustomerSerializer(request.tenant)
    return Response(serializer.data)