from django.db.models import F
from rest_framework.permissions import IsAuthenticated
from blah.api.serializers import CommentSerializer
from blah.api.views import CommentList
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import EmployeeSerializer, CoachChangeRequestSerializer, SanitizedEmployeeSerializer
from ..models import Employee, CoachCapacity


class EmployeeCommentList(CommentList):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        pk = self.kwargs['pk']
        return Employee.objects.get(pk=pk)


class Profile(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        current_user = request.user
        if current_user.employee is not None:
            serializer = EmployeeSerializer(current_user.employee, context={'request': request})
            return Response(serializer.data)
        return Response(None, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def available_coaches(request):
    coaches = [c.employee for c in CoachCapacity.objects.filter(num_coachees__lt=F('max_allowed_coachees'))]
    serializer = SanitizedEmployeeSerializer(data=coaches, many=True)
    if serializer.is_valid():
        return Response(data=serializer.data)
    return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def change_coach(request):
    serializer = CoachChangeRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    coach = serializer.new_coach
    try:
        capacity = CoachCapacity.objects.get(employee=coach)
        if capacity.is_full():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        employee = request.user.employee
        employee.coach = coach
        employee.save()
        return Response(status=status.HTTP_202_ACCEPTED)
    except CoachCapacity.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

