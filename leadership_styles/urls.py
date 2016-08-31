from django.conf.urls import *
from api.views import *
from views import StartQuiz

urlpatterns = [
    url(r'^take-the-quiz/$', StartQuiz.as_view(), name='start-quiz'),
    url(r'^take-the-quiz/(?P<pk>.+)/$', GetQuiz.as_view()),
]