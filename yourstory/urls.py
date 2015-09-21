from django.conf.urls import *
from .views import Index, Question

urlpatterns = [
    url(r'^$', Index.as_view(), name="index"),
    url(r'^questions/(?P<question_number>[0-9]+)/$', Question.as_view(), name="question"),
]
