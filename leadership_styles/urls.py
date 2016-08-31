from api.views import *
from django.conf.urls import *
from django.views.generic.base import TemplateView
from views import StartQuiz

urlpatterns = [
    url(r'^confirmation/?$', TemplateView.as_view(template_name="confirmation.html"), name='confirmation'),
    url(r'^take-the-quiz/$', StartQuiz.as_view(), name='start-quiz'),
    url(r'^take-the-quiz/(?P<pk>.+)/$', GetQuiz.as_view()),
]