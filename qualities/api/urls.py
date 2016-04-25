from django.conf.urls import *
from views import *

urlpatterns = patterns('',
    url(r'^clusters/$', QualityClusters.as_view()),
    url(r'^clusters/(?P<pk>[0-9]*)/$', RetrieveQualityCluster.as_view()),
    url(r'^perception/$', CreatePerceivedQuality.as_view()),
    url(r'^perception/my/$', perceived_qualities_report),
    url(r'^requests/$', CreatePerceptionRequest.as_view()),
    url(r'^requests/recently-sent/$', RecentPerceptionRequestsIveSentList.as_view()),
    url(r'^requests/(?P<pk>[0-9]*)/$', RetrievePerceptionRequest.as_view()),
    url(r'^requests/todo/$', PerceptionRequestsToDoList.as_view(), name='todo-requests'),
)