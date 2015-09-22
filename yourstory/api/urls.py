from django.conf.urls import *
from .views import PublicYourStoryDetail, PrivateYourStoryDetail

urlpatterns = [
    url(r'^$', PrivateYourStoryDetail.as_view(), name="private-your-story-detail"),
    url(r'^employees/(?P<pk>[0-9]*)/$', PublicYourStoryDetail.as_view(), name="public-your-story-detail"),
]
