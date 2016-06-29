from django.conf.urls import *
from django.views.decorators.cache import cache_page
from views import *

urlpatterns = [
    url(r'^coaches/available/$', available_coaches, name='available-coaches'),
    url(r'^coaches/change/$', change_coach, name='change-coach'),
    url(r'^coaches/current/$', CurrentCoach.as_view(), name='my-coach'),
    url(r'^coaches/profile/$', CreateCoachProfile.as_view()),
    url(r'^coaches/profile/(?P<pk>[0-9]+)/update/$', UpdateCoachProfile.as_view()),
    url(r'^employees/all-access/$', cache_page(60*1440)(all_access_employees)),
    url(r'^employees/(?P<pk>[0-9]+)/coaching/profile/$', RetrieveCoachProfile.as_view()),
    url(r'^profile/$', my_profile),
    url(r'^team/(?P<pk>[0-9]+)/leads/$', team_leads),
    url(r'^team/(?P<pk>[0-9]+)/members/$', TeamMemberList.as_view(), name='employee-list'),
    url(r'^team-lead/my/$', my_team_lead),
    url(r'^team-lead/my/employees/$', my_employees),
    url(r'^team-lead/(?P<pk>[0-9]+)/employees/$', team_lead_employees),
]
