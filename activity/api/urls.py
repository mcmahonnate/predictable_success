from django.conf.urls import *
from views import *

urlpatterns = patterns('',
    url(r'^employees/(?P<employee_id>[0-9]+)/$', EmployeeEventList.as_view()),
    url(r'^teams/(?P<pk>[0-9]+)/$', TeamEventList.as_view()),
    url(r'^leads/$', MyTeamEventList.as_view()),
    url(r'^leads/(?P<pk>[0-9]+)/$', LeadEventList.as_view()),
    url(r'^coaches/$', CoachEventList.as_view()),
    url(r'^checkins/(?P<pk>[0-9]+)/$', CheckInEventList.as_view()),
    url(r'^$', EventList.as_view()),
    url(r'^sources/comments/(?P<pk>[0-9]+)/$', CommentEvent.as_view()),
)
