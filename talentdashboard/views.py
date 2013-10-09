from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response
from pvp.models import PvpEvaluation
from org.models import Employee, Team, Mentorship
from .serializers import PvpEvaluationSerializer, EmployeeSerializer, TeamSerializer, MentorshipSerializer

class EmployeeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class MentorshipViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MentorshipSerializer
    queryset = Mentorship.objects.all()

    def get_queryset(self):
        mentee_id = self.request.QUERY_PARAMS.get('mentee_id', None)
        mentor_id = self.request.QUERY_PARAMS.get('mentor_id', None)
        if mentee_id is not None:
            self.queryset = self.queryset.filter(mentee__id=mentee_id)
        if mentor_id is not None:
            self.queryset = self.queryset.filter(mentor__id=mentor_id)

        return self.queryset

@api_view(['GET'])
def current_pvp_evaluations(request):
    evaluations = PvpEvaluation.objects.get_all_current_evaluations()
    if request.GET.__contains__('talent_category'):
        talent_category = int(request.GET.__getitem__('talent_category'))
        evaluations = [evaluation for evaluation in evaluations if evaluation.get_talent_category() == talent_category]

    serializer = PvpEvaluationSerializer(evaluations, many=True)
    return Response(serializer.data)
