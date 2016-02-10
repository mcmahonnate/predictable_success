from django.conf.urls import *
from views import *

urlpatterns = [
    url(r'^conversations/current/$', RetrieveMyCurrentConversation.as_view()),
    url(r'^conversations/team-lead/$', RetrieveMyTeamLeadConversations.as_view()),
    url(r'^meetings/(?P<pk>[0-9]*)/conversations/$', RetrieveMeetingConversations.as_view()),
    url(r'^meetings/(?P<pk>[0-9]*)/$', RetrieveMeeting.as_view()),
    url(r'^meetings/$', RetrieveMyCurrentMeetings.as_view()),
    url(r'^selfies/start/$', CreateEmployeeZone.as_view()),
    url(r'^selfies/unfinished/$', RetrieveUnfinishedEmployeeZone.as_view()),
    url(r'^selfies/(?P<pk>[0-9]*)/$', RetrieveEmployeeZone.as_view()),
    url(r'^selfies/(?P<pk>[0-9]+)/update/$', UpdateEmployeeZone.as_view()),
    url(r'^selfies/(?P<pk>[0-9]+)/retake/$', RetakeEmployeeZone.as_view()),
    url(r'^selfies/$', RetrieveMyEmployeeZones.as_view()),
]