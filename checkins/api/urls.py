from django.conf.urls import *
from views import *

urlpatterns = patterns('',
    url(r'^$', CreateCheckIn.as_view()),
    url(r'^checkin-types/$', CheckInTypeList.as_view()),
    url(r'^hosted/$', HostCheckInList.as_view()),
    url(r'^my/$', RetrieveMyCheckIns.as_view()),
    url(r'^reports/$', checkin_report),
    url(r'^requests/$', CreateCheckInRequest.as_view()),
    url(r'^requests/my/$', MyCheckInRequests.as_view()),
    url(r'^requests/todo/$', CheckInRequestToDos.as_view()),
    url(r'^requests/(?P<pk>[0-9]+)/cancel/$', CancelCheckInRequest.as_view()),
    url(r'^(?P<pk>[0-9]+)/send/$', SendCheckInToEmployee.as_view()),
    url(r'^(?P<pk>[0-9]+)/share/$', ShareCheckIn.as_view()),
    url(r'^(?P<pk>[0-9]+)/comments/$', CheckInCommentList.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', RetrieveUpdateDestroyCheckIn.as_view()),
)
