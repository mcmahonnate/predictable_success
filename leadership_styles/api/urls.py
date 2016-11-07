from django.conf.urls import *
from views import *

urlpatterns = [
    url(r'^create/$', CreateEmployeeLeadershipStyle.as_view()),
    url(r'^teases/$', RetrieveLeadershipStyleTeases.as_view()),
    url(r'^my/$', RetrieveMyEmployeeLeadershipStyle.as_view()),
    url(r'^my/unfinished/$', RetrieveUnfinishedEmployeeLeadershipStyle.as_view()),
    url(r'^(?P<pk>[0-9]*)/$', RetrieveEmployeeLeadershipStyle.as_view()),
    url(r'^(?P<pk>[0-9]*)/previous-question/$', UpdatePreviousQuestion.as_view()),
    url(r'^(?P<pk>[0-9]*)/update/$', UpdateEmployeeLeadershipStyle.as_view()),
    url(r'^(?P<pk>[0-9]*)/finish/$', CompleteEmployeeLeadershipStyle.as_view()),
    url(r'^teams/followup/$', FollowupAboutTeam.as_view()),
    url(r'^teams/owned/$', RetrieveTeamsLeadershipStylesIOwn.as_view()),
    url(r'^teams/(?P<pk>[0-9]*)/invite/$', InviteTeamMembers.as_view()),
    url(r'^teams/(?P<pk>[0-9]*)/members/remove/$', RemoveTeamMember.as_view()),
    url(r'^teams/(?P<pk>[0-9]*)/request-report/$', RequestTeamReport.as_view()),
    url(r'^teams/(?P<pk>[0-9]*)/$', RetrieveTeamLeadershipStyle.as_view()),
    url(r'^teams/$', RetrieveTeamLeadershipStylesIBelongTo.as_view()),
    url(r'^requests/$', CreateRequest.as_view()),
    url(r'^requests/recently-sent/$', RecentRequestsIveSentList.as_view()),
    url(r'^requests/(?P<pk>[0-9]*)/$', RetrieveRequest.as_view()),
    url(r'^requests/todo/$', RequestsToDoList.as_view(), name='todo-requests'),
    url(r'^quiz/(?P<pk>[0-9]*)/remind/$', SendQuizReminder.as_view()),
    url(r'^quiz/remind/$', RemindTeamMembers.as_view())
]
