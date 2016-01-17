from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.generics import *
from blah.api.views import CommentList, CreateComment
from blah.api.serializers import CommentSerializer
from org.models import Employee
from ..models import Project
from .serializers import *
from talentdashboard.views.views import StandardResultsSetPagination


# CheckIn views
class CreateProject(CreateAPIView):
    """ Create a CheckIn via POST.
    """
    serializer_class = ProjectSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(host=self.request.user.employee)

class ProjectsByOwner(ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if 'pk' in self.kwargs:
            pk = self.kwargs['pk']
            employee = Employee.objects.get(pk=pk)
            return Project.objects.get_for_owner(employee)
        else:
            return Project.objects.get_for_owner(self.request.user.employee)


class ProjectsBySponsor(ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if 'pk' in self.kwargs:
            pk = self.kwargs['pk']
            employee = Employee.objects.get(pk=pk)
            return Project.objects.get_for_sponsor(employee)
        else:
            return Project.objects.get_for_sponsor(self.request.user.employee)


class ProjectsByTeamMember(ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if 'pk' in self.kwargs:
            pk = self.kwargs['pk']
            employee = Employee.objects.get(pk=pk)
            return Project.objects.get_for_team_member(employee)
        else:
            return Project.objects.get_for_team_member(self.request.user.employee)


class RetrieveUpdateDestroyProject(RetrieveUpdateDestroyAPIView):
    """ Retrieve, Update, or Delete a CheckIn via GET, PUT, DELETE.
    """
    queryset = Project.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = ProjectSerializer