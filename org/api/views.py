from rest_framework.permissions import IsAuthenticated
from blah.api.serializers import CommentSerializer
from blah.api.views import CommentList
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import EmployeeSerializer
from ..models import Employee


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
