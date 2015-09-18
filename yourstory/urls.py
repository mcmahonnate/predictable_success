from django.conf.urls import *
from .views import YourStoryDetail, Questions

urlpatterns = [
    url(r'^$', YourStoryDetail.as_view(), name="index"),
    url(r'^questions/(?P<question_number>[0-9]+)/$', Questions.as_view(), name="question"),
]
