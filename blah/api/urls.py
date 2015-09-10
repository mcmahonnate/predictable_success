from django.conf.urls import *
from .views import CommentReplyList

urlpatterns = patterns('',
    url(r'^(?P<pk>[0-9]+)/replies/$', CommentReplyList.as_view()),
)
