from django.conf.urls import *
from .views import *

urlpatterns = patterns('',
    url(r'^$', CommentList.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', CommentDetail.as_view()),
    url(r'^(?P<pk>[0-9]+)/replies/$', CommentReplyList.as_view()),
    url(r'^employees/(?P<pk>[0-9]+)/$', EmployeeCommentList.as_view()),
    url(r'^teams/(?P<pk>[0-9]+)/$', TeamCommentList.as_view()),
    url(r'^leads/$', LeadCommentList.as_view()),
    url(r'^coaches/$', CoachCommentList.as_view()),
    url(r'^subcomments/(?P<pk>[0-9]+)/$', SubCommentList.as_view()),
)
