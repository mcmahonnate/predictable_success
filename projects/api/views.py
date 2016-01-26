from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import *
from blah.api.views import CommentList
from org.models import Employee
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import *
from ..models import *
from talentdashboard.views.views import StandardResultsSetPagination


# CheckIn views
class CreateProject(ListCreateAPIView):
    """ Create a CheckIn via POST.
    """
    serializer_class = ProjectSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Project.objects.all()

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


class ProjectCommentList(CommentList):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = StandardResultsSetPagination

    def get_object(self):
        pk = self.kwargs['pk']
        return Project.objects.get(pk=pk)


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def project_rules(request):
    rule = PrioritizationRule.objects.get_current()
    serializer = PrioritizationRuleSerializer(rule, context={'request': request})
    return Response(serializer.data)
