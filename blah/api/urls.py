from django.conf.urls import *
from views import CheckInCommentList

urlpatterns = patterns('',
    url(r'^checkins/(?P<pk>[0-9]+)/$', CheckInCommentList.as_view()),
)
