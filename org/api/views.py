from rest_framework.permissions import IsAuthenticated
from blah.api.serializers import CommentSerializer
from blah.api.views import CommentList
from ..models import Employee


class EmployeeCommentList(CommentList):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        pk = self.kwargs['pk']
        return Employee.objects.get(pk=pk)
