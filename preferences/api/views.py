from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from org.api.serializers import UserPreferencesSerializer


class RetrieveUpdateUserPreferences(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = UserPreferencesSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = request.user.preferences
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = request.user.preferences
        serializer = self.get_serializer(instance, context={'request':request})
        return Response(serializer.data)


