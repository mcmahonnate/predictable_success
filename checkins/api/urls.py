from django.conf.urls import *
from views import *

urlpatterns = patterns('',
    url(r'^$', CreateCheckIn.as_view()),
    url(r'my/$', RetrieveMyCheckIns.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', RetrieveUpdateDestroyCheckIn.as_view()),
    url(r'^employees/(?P<employee_id>[0-9]+)/$', EmployeeCheckInList.as_view()),
    url(r'^hosted/$', HostCheckInList.as_view()),
    url(r'^checkin-types/$', CheckInTypeList.as_view()),
    url(r'^(?P<pk>[0-9]+)/comments/$', CheckInCommentList.as_view()),
)
