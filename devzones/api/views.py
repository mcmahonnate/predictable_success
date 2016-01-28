from rest_framework.generics import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response
from ..models import *
from .serializers import *
from .permissions import *


# CheckIn views
class CreateEmployeeZone(CreateAPIView):
    serializer_class = CreateEmployeeZoneSerializer
    permission_classes = (IsAuthenticated,)


class RetrieveUpdateEmployeeZone(RetrieveUpdateAPIView):
    serializer_class = EmployeeZoneSerializer
    permission_classes = (IsAuthenticated,)
    queryset = EmployeeZone.objects.all()