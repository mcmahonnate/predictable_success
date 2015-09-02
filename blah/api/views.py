from rest_framework import generics, views
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import AddCommentSerializer, CommentSerializer
from blah.models import Comment
from checkins.models import CheckIn


class CreateComment(generics.CreateAPIView):
    serializer_class = AddCommentSerializer

    def create(self, request, *args, **kwargs):
        deserializer = self.get_serializer(data=request.data)
        deserializer.is_valid(raise_exception=True)
        owner = request.user
        subject = self.get_object()
        comment = Comment.objects.add_comment(subject, deserializer.data['content'], deserializer.data['visibility'], deserializer.data['include_in_daily_digest'], owner)
        serializer = CommentSerializer(comment, context={'request': request})
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        subject = self.get_object()
        return Comment.objects.get_for_object(subject)

    def create(self, request, *args, **kwargs):
        deserializer = AddCommentSerializer(data=request.data)
        deserializer.is_valid(raise_exception=True)
        owner = request.user
        subject = self.get_object()
        comment = Comment.objects.add_comment(subject, deserializer.data['content'], deserializer.data['visibility'], deserializer.data['include_in_daily_digest'], owner)
        serializer = CommentSerializer(comment, context={'request': request})
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CreateCheckinComment(CreateComment):
    queryset = CheckIn.objects.all()


class CheckInCommentList(CommentList):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        pk = self.kwargs['pk']
        return CheckIn.objects.get(pk=pk)
