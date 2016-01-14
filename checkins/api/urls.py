from django.conf.urls import *
from views import *

urlpatterns = patterns('',
    url(r'^$', CreateCheckIn.as_view()),
    url(r'my/$', RetrieveMyCheckIns.as_view()),
    url(r'^(?P<pk>[0-9]+)/send/$', SendCheckInToEmployee.as_view()),
    url(r'^(?P<pk>[0-9]+)/share/$', ShareCheckIn.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', RetrieveUpdateDestroyCheckIn.as_view()),
    url(r'^hosted/$', HostCheckInList.as_view()),
    url(r'^checkin-types/$', CheckInTypeList.as_view()),
    url(r'^(?P<pk>[0-9]+)/comments/$', CheckInCommentList.as_view()),
)
