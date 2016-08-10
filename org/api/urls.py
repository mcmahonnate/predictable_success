from django.conf.urls import *
from django.views.decorators.cache import cache_page
from preferences.api.views import RetrieveUpdateUserPreferences
from predictable_success.views.views import user_status, UserList
from views import *

urlpatterns = [
    url(r'^coaches/all/$', all_coaches),
    url(r'^coaches/available/$', available_coaches, name='available-coaches'),
    url(r'^coaches/change/$', change_coach, name='change-coach'),
    url(r'^coaches/current/$', CurrentCoach.as_view(), name='my-coach'),
    url(r'^coaches/profile/$', CreateCoachProfile.as_view()),
    url(r'^coaches/profile/(?P<pk>[0-9]+)/update/$', UpdateCoachProfile.as_view()),
    url(r'^coaches/report/$', coaches_report),
    url(r'^coaches/report/blacklist/$', coaches_blacklist_report),
    url(r'^coaches/$', cache_page(60*1440)(CoachList.as_view()), name='coach-list'),
    url(r'^coachees/$', coachee_list),
    url(r'^employees/all-access/$', cache_page(60*1440)(all_access_employees)),
    url(r'^employee-names/$', EmployeeNames.as_view(), name='employee-name-list'),
    url(r'^employees/(?P<pk>[0-9]+)/$', EmployeeDetail.as_view(), name='employee-detail'),
    url(r'^employees/(?P<pk>[0-9]+)/coaching/profile/$', RetrieveCoachProfile.as_view()),
    url(r'^employees/$', (cache_page(60*1440)(EmployeeList.as_view())), name='employee-list'),
    url(r'^leaderships/employees/(?P<pk>[0-9]+)/$', LeadershipDetail.as_view()),
    url(r'^profile/$', my_profile),
    url(r'^team/(?P<pk>[0-9]+)/leads/$', team_leads),
    url(r'^team/(?P<pk>[0-9]+)/members/$', TeamMemberList.as_view(), name='employee-list'),
    url(r'^team-lead/my/$', my_team_lead),
    url(r'^team-lead/my/employees/$', my_employees),
    url(r'^team-lead/(?P<pk>[0-9]+)/employees/$', team_lead_employees),
    url(r'^user/$', user_status),
    url(r'^user/preferences/$', RetrieveUpdateUserPreferences.as_view()),
    url(r'^users/$', UserList.as_view()),
]
