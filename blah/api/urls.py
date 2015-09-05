from django.conf.urls import *
from views import CheckInCommentList, CommentReplyList

urlpatterns = patterns('',
    url(r'^checkins/(?P<pk>[0-9]+)/$', CheckInCommentList.as_view()),
    url(r'^(?P<pk>[0-9]+)/replies/$', CommentReplyList.as_view()),
)
