from django.conf.urls import *
from api.views import *

urlpatterns = [
    url(r'^take-the-quiz/(?P<pk>.+)/$', GetQuiz.as_view()),
]