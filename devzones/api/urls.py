from django.conf.urls import *
from views import *

urlpatterns = [
    url(r'^conversations/create/$', CreateManyConversations.as_view()),
    url(r'^conversations/delete/$', DeleteManyConversations.as_view()),
    url(r'^conversations/my/$', RetrieveMyConversations.as_view()),
    url(r'^conversations/my/current/$', RetrieveMyCurrentConversation.as_view()),
    url(r'^conversations/team-lead/$', RetrieveMyTeamLeadConversations.as_view()),
    url(r'^conversations/update/$', UpdateManyConversations.as_view()),
    url(r'^conversations/(?P<pk>[0-9]*)/$', RetrieveUpdateConversation.as_view()),
    url(r'^meetings/(?P<pk>[0-9]*)/activate/$', ActivateMeeting.as_view()),
    url(r'^meetings/(?P<pk>[0-9]*)/conversations/$', RetrieveMeetingConversations.as_view()),
    url(r'^meetings/(?P<pk>[0-9]*)/update/$', UpdateMeeting.as_view()),
    url(r'^meetings/(?P<pk>[0-9]*)/$', RetrieveMeeting.as_view()),
    url(r'^meetings/create/$', CreateMeeting.as_view()),
    url(r'^meetings/$', RetrieveMyCurrentMeetings.as_view()),
    url(r'^reports/$', devzone_report),
    url(r'^selfies/create/$', CreateEmployeeZone.as_view()),
    url(r'^selfies/my/$', RetrieveMyEmployeeZones.as_view()),
    url(r'^selfies/unfinished/$', RetrieveUnfinishedEmployeeZone.as_view()),
    url(r'^selfies/(?P<pk>[0-9]*)/$', RetrieveEmployeeZone.as_view()),
    url(r'^selfies/(?P<pk>[0-9]*)/comments/$', EmployeeZoneCommentList.as_view()),
    url(r'^selfies/(?P<pk>[0-9]+)/retake/$', RetakeEmployeeZone.as_view()),
    url(r'^selfies/(?P<pk>[0-9]+)/share/$', ShareEmployeeZone.as_view()),
    url(r'^selfies/(?P<pk>[0-9]+)/update/$', UpdateEmployeeZone.as_view()),
    url(r'^zones/$', RetrieveZones.as_view()),
]