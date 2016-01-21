from django.conf.urls import *
from views import *

urlpatterns = patterns('',
    url(r'^employees/$', employee_search),
    url(r'^employees/lead/(?P<pk>[0-9]+)/$', lead_employee_search),
    url(r'^employees/my-team/$', my_team_employee_search),
    url(r'^employees/my-leaders/$', my_leaders),
    url(r'^employees/my-coachees/$', my_coachees_employee_search),
    url(r'^reports/talent/lead/(?P<pk>[0-9]+)/$', lead_talent_report),
    url(r'^reports/talent/my-team/$', my_team_talent_report),
    url(r'^reports/talent/my-coachees/$', my_coachees_talent_report),
    url(r'^reports/talent/$', talent_report),
    url(r'^reports/salary/lead/(?P<pk>[0-9]+)/$', lead_salary_report),
    url(r'^reports/salary/my-team/$', my_team_salary_report),
    url(r'^reports/salary/my-coachees/$', my_coachees_salary_report),
    url(r'^reports/salary/$', salary_report),
)