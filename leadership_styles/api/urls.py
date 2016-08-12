from django.conf.urls import *
from views import *

urlpatterns = [
    url(r'^create/$', CreateEmployeeLeadershipStyle.as_view()),
    url(r'^my/$', RetrieveMyEmployeeLeadershipStyle.as_view()),
    url(r'^my/unfinished/$', RetrieveUnfinishedEmployeeLeadershipStyle.as_view()),
    url(r'^(?P<pk>[0-9]*)/$', RetrieveEmployeeLeadershipStyle.as_view()),
    url(r'^(?P<pk>[0-9]*)/previous-question/$', UpdatePreviousQuestion.as_view()),
    url(r'^(?P<pk>[0-9]*)/update/$', UpdateEmployeeLeadershipStyle.as_view()),
]