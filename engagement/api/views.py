from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ..models import Happiness
from .serializers import HappinessSerializer, AddEditHappinessSerializer


# Happiness views
class CreateHappiness(generics.CreateAPIView):
    """ Create a Happiness via POST.
    """
    serializer_class = AddEditHappinessSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(assessed_by=self.request.user.employee)


class RetrieveUpdateDestroyHappiness(generics.RetrieveUpdateDestroyAPIView):
    """ Retrieve, Update, or Delete a Happiness via GET, PUT, DELETE.
    """
    queryset = Happiness.objects.all()
    serializer_class = HappinessSerializer
    permission_classes = (IsAuthenticated,)


class EmployeeHappinessList(generics.ListAPIView):
    """ Get a list of Happiness assessments for a given employee via employee_id query param.
    """
    serializer_class = HappinessSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        employee_id = self.kwargs['employee_id']
        return Happiness.objects.filter(employee_id=employee_id)

