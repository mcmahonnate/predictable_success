from rest_framework.decorators import api_view
from rest_framework.response import Response
from pvp.models import PvpEvaluation
from .serializers import PvpEvaluationSerializer

@api_view(['GET'])
def current_pvp_evaluations(request):
    evaluations = PvpEvaluation.objects.get_all_current_evaluations()
    if request.GET.__contains__('talent_category'):
        talent_category = int(request.GET.__getitem__('talent_category'))
        evaluations = [evaluation for evaluation in evaluations if evaluation.get_talent_category() == talent_category]

    serializer = PvpEvaluationSerializer(evaluations, many=True)
    return Response(serializer.data)
