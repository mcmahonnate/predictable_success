from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from org.models import Employee
from blah.models import Comment
from serializers import CreateCommentSerializer, EmployeeCommentSerializer


class EmployeeDiscussions(APIView):
    def get_employee(self, id):
        return Employee.objects.get(id=id)

    def get(self, request, employee_id):
        try:
            employee = self.get_employee(employee_id)
            comments = Comment.objects.get_for_object(employee)
            serializer = EmployeeCommentSerializer(comments, many=True)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(None, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, employee_id):
        try:
            employee = self.get_employee(employee_id)
            serializer = CreateCommentSerializer(data=request.DATA)
            if serializer.is_valid():
                new_comment = serializer.validated_data
                content = new_comment.get('content', None)
                visibility = new_comment.get('visibility', 3)
                owner = request.user
                comment = employee.comments.add_comment(content, visibility, owner)
                serializer = EmployeeCommentSerializer(comment)
                return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(None, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, employee_id, comment_id):
        try:
            employee = self.get_employee(employee_id)
            serializer = CreateCommentSerializer(data=request.DATA)
            if serializer.is_valid():
                new_comment = serializer.validated_data
                content = new_comment.get('content', None)
                visibility = new_comment.get('visibility', 3)
                owner = request.user
                comment = employee.comments.add_comment(content, visibility, owner)
                serializer = EmployeeCommentSerializer(comment)
                return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
