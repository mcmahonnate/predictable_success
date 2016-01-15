from django.conf.urls import *
from views import *

urlpatterns = [
    url(r'^coaches/available/$', available_coaches, name='available-coaches'),
    url(r'^coaches/change/$', change_coach, name='change-coach'),
    url(r'^coaches/current/$', CurrentCoach.as_view(), name='my-coach'),
    url(r'^team/(?P<pk>[0-9]+)/leads/$', team_leads),
    url(r'^team/(?P<pk>[0-9]+)/members/$', TeamMemberList.as_view(), name='employee-list'),
    url(r'^team-lead/my/$', my_team_lead),
    url(r'^team-lead/my/employees/$', my_employees),
    url(r'^team-lead/(?P<pk>[0-9]+)/employees/$', team_lead_employees),
]
