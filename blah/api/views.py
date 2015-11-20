from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from django.contrib.contenttypes.models import ContentType
from .serializers import CreateCommentSerializer, CommentSerializer, SubCommentSerializer, TeamCommentSerializer, EmployeeCommentSerializer
from blah.models import Comment
from org.models import Employee
from talentdashboard.views.views import PermissionsViewThisEmployee, PermissionsViewAllEmployees, StandardResultsSetPagination


class PermissionsViewThisComment(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.has_perm('org.view_employees'):
            return True
        else:
            pk = view.kwargs['pk']
            requester = Employee.objects.get(user=request.user)
            comment = Comment.objects.get(id=pk)
            employee = comment.owner.employee
            has_permission = requester.is_ancestor_of(employee)
            if not has_permission and requester.id == employee.coach.id:
                has_permission = True
            return has_permission


class CommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):

        subject = self.get_object()
        return Comment.objects.get_for_object(subject)

    def create(self, request, *args, **kwargs):
        deserializer = CreateCommentSerializer(data=request.data)
        deserializer.is_valid(raise_exception=True)
        owner = request.user
        subject = self.get_object()
        comment = Comment.objects.add_comment(subject, deserializer.data['content'], deserializer.data.get('visibility', 3), deserializer.data['include_in_daily_digest'], owner)
        serializer = CommentSerializer(comment, context={'request': request})
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)



class EmployeeCommentList(CommentList):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated, PermissionsViewThisEmployee)

    def get_object(self):
        pk = self.kwargs['pk']
        return Employee.objects.get(pk=pk)


class SubCommentList(APIView):
    permission_classes = (IsAuthenticated, PermissionsViewThisComment)

    def get(self, request, pk, format=None):
        comment_type = ContentType.objects.get(model="comment")
        comments = Comment.objects.filter(object_id=pk)
        comments = comments.filter(content_type=comment_type)
        comments = comments.extra(order_by=['-created_date'])
        serializer = SubCommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data)


class LeadCommentList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        requester = Employee.objects.get(user__id=request.user.id)
        employee_ids = Employee.objects.get_current_employees_by_team_lead(lead_id=requester.id).values('id')
        if not employee_ids:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        comments = Comment.objects.get_comments_for_employees(requester=requester, employee_ids=employee_ids)
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(comments, request)
        serializer = TeamCommentSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class CoachCommentList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        requester = Employee.objects.get(user__id=request.user.id)
        employee_ids = Employee.objects.get_current_employees_by_coach(coach_id=requester.id).values('id')
        if not employee_ids:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        comments = Comment.objects.get_comments_for_employees(requester=requester, employee_ids=employee_ids)
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(comments, request)
        serializer = TeamCommentSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class TeamCommentList(APIView):
    permission_classes = (IsAuthenticated, PermissionsViewAllEmployees)

    def get(self, request, pk, format=None):
        requester = Employee.objects.get(user__id=request.user.id)
        employee_ids = Employee.objects.get_current_employees_by_team(team_id=pk).values('id')
        if not employee_ids:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        comments = Comment.objects.get_comments_for_employees(requester=requester, employee_ids=employee_ids)
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(comments, request)
        serializer = TeamCommentSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class CreateComment(generics.CreateAPIView):
    serializer_class = CreateCommentSerializer

    def create(self, request, *args, **kwargs):
        deserializer = self.get_serializer(data=request.data)
        deserializer.is_valid(raise_exception=True)
        owner = request.user
        subject = self.get_object()
        comment = Comment.objects.add_comment(subject, deserializer.data['content'], deserializer.data['visibility'], deserializer.data['include_in_daily_digest'], owner)
        serializer = CommentSerializer(comment, context={'request': request})
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated, PermissionsViewThisComment)
    queryset = Comment.objects.all()

    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.owner.id is not request.user.id:
            raise PermissionDenied
        return super(generics.RetrieveUpdateDestroyAPIView, self).update(request, *args, **kwargs)


class CommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        subject = self.get_object()
        return Comment.objects.get_for_object(subject)

    def create(self, request, *args, **kwargs):
        deserializer = CreateCommentSerializer(data=request.data)
        deserializer.is_valid(raise_exception=True)
        owner = request.user
        subject = self.get_object()
        comment = Comment.objects.add_comment(subject, deserializer.data['content'], deserializer.data.get('visibility', 3), deserializer.data['include_in_daily_digest'], owner)
        serializer = CommentSerializer(comment, context={'request': request})
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CommentReplyList(CommentList):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        pk = self.kwargs['pk']
        return Comment.objects.get(pk=pk)
