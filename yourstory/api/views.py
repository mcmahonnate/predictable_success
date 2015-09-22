from rest_framework import generics
from .serializers import PublicYourStorySerializer, PrivateYourStorySerializer
from ..models import YourStory


class YourStoryDetail(generics.RetrieveAPIView):
    queryset = YourStory.objects.all()


class PublicYourStoryDetail(YourStoryDetail):
    serializer_class = PublicYourStorySerializer

    def get_object(self):
        employee_id = self.kwargs[self.lookup_field]
        return generics.get_object_or_404(self.get_queryset(), employee_id=employee_id)


class PrivateYourStoryDetail(YourStoryDetail):
    serializer_class = PrivateYourStorySerializer

    def get_object(self):
        return generics.get_object_or_404(self.get_queryset(), employee=self.request.user.employee)

