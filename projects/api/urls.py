from django.conf.urls import *
from views import *

urlpatterns = patterns('',
    url(r'^$', CreateProject.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', RetrieveUpdateDestroyProject.as_view()),
    url(r'^criteria/$', project_rules),
    url(r'^owned/(?P<pk>[0-9]+)/$', ProjectsByOwner.as_view()),
    url(r'^owned/my/$', ProjectsByOwner.as_view()),
    url(r'^sponsored/(?P<pk>[0-9]+)/$', ProjectsBySponsor.as_view()),
    url(r'^sponsored/my/$', ProjectsBySponsor.as_view()),
    url(r'^team-member/(?P<pk>[0-9]+)/$', ProjectsByTeamMember.as_view()),
    url(r'^team-member/my/$', ProjectsByTeamMember.as_view()),
    url(r'^(?P<pk>[0-9]+)/comments/$', ProjectCommentList.as_view()),
)
