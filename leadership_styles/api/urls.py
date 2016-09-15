from django.conf.urls import *
from views import *

urlpatterns = [
    url(r'^create/$', CreateEmployeeLeadershipStyle.as_view()),
    url(r'^my/$', RetrieveMyEmployeeLeadershipStyle.as_view()),
    url(r'^my/unfinished/$', RetrieveUnfinishedEmployeeLeadershipStyle.as_view()),
    url(r'^(?P<pk>[0-9]*)/$', RetrieveEmployeeLeadershipStyle.as_view()),
    url(r'^(?P<pk>[0-9]*)/previous-question/$', UpdatePreviousQuestion.as_view()),
    url(r'^(?P<pk>[0-9]*)/update/$', UpdateEmployeeLeadershipStyle.as_view()),
    url(r'^teams/invite/$', InviteTeam.as_view()),
    url(r'^teams/(?P<pk>[0-9]*)/$', TeamLeadershipStyle.as_view()),
    url(r'^requests/$', CreateRequest.as_view()),
    url(r'^requests/recently-sent/$', RecentRequestsIveSentList.as_view()),
    url(r'^requests/(?P<pk>[0-9]*)/$', RetrieveRequest.as_view()),
    url(r'^requests/todo/$', RequestsToDoList.as_view(), name='todo-requests'),
]