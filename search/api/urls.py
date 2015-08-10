from django.conf.urls import *
from views import employee_search, salary_report, my_team_salary_report, my_coachees_salary_report, talent_report, my_team_talent_report, my_coachees_talent_report, my_team_employee_search, my_coachees_employee_search

urlpatterns = patterns('',
    url(r'^employees/$', employee_search),
    url(r'^employees/my-team/$', my_team_employee_search),
    url(r'^employees/my-coachees/$', my_coachees_employee_search),
    url(r'^reports/talent/my-team/$', my_team_talent_report),
    url(r'^reports/talent/my-coachees/$', my_coachees_talent_report),
    url(r'^reports/talent/$', talent_report),
    url(r'^reports/salary/my-team/$', my_team_salary_report),
    url(r'^reports/salary/my-coachees/$', my_coachees_salary_report),
    url(r'^reports/salary/$', salary_report),
)