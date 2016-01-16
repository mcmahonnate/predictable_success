from rest_framework import generics
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from org.models import Employee
from ..models import Happiness
from .serializers import HappinessSerializer, AddEditHappinessSerializer
from org.api.permissions import PermissionsViewThisEmployee


class PermissionsViewThisHappiness(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.has_perm('org.view_employees'):
            return True
        else:
            pk = view.kwargs['pk']
            requester = Employee.objects.get(user=request.user)
            happiness = Happiness.objects.get(id=pk)
            employee = happiness.employee
            has_permission = requester.is_ancestor_of(employee)
            if not has_permission and requester.id == employee.coach.id:
                has_permission = True
            return has_permission


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
    permission_classes = (IsAuthenticated, PermissionsViewThisHappiness)


class EmployeeHappinessList(generics.ListAPIView):
    """ Get a list of Happiness assessments for a given employee via employee_id query param.
    """
    serializer_class = HappinessSerializer
    permission_classes = (IsAuthenticated, PermissionsViewThisEmployee)

    def get_queryset(self):
        employee_id = self.kwargs['pk']
        return Happiness.objects.filter(employee_id=employee_id)

