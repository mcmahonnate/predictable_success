from django.conf import settings
from django.conf.urls import *
from django.contrib import admin
from django.views.generic import TemplateView
from django.contrib.auth.views import password_reset, password_reset_confirm, password_reset_done, password_reset_complete, login, logout
from views import *
from forms import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'api/v1/teams', TeamViewSet)
router.register(r'api/v1/mentorships', MentorshipViewSet)
router.register(r'api/v1/leaderships', LeadershipsViewSet)
router.register(r'api/v1/attributes', AttributeViewSet)

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name="index.html"), name='home'),
    url(r'^logout/$', logout,{'next_page': '/login/'}),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^account/login/?$',login,{'template_name':'login.html', 'authentication_form':CustomAuthenticationForm}, name='login'),
    url(r'^account/password_reset/done/$', password_reset_done, {'template_name': 'password_reset_done.html'}),
    url(r'^account/reset/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$', password_reset_confirm, {'template_name': 'password_reset_confirm.html', 'set_password_form':CustomSetPasswordForm}),
    url(r'^account/reset/complete/$', password_reset_complete, {'template_name': 'password_reset_complete.html'}),
    url(r'^account/reset/done/$', password_reset_complete, {'template_name': 'password_reset_complete.html'}),
    url(r'^account/', include('django.contrib.auth.urls')),
    url(r'^accounts/password/reset/$', password_reset, {'template_name': 'password_reset_form.html', 'email_template_name': 'password_reset_email.html'}),
    url(r'api/v1/current_site/$', current_site),
    url(r'api/v1/kpi-performance/$', current_kpi_performance),
    url(r'api/v1/kpi-indicator/$', current_kpi_indicator),
    url(r'api/v1/user-status/$', user_status),
    url(r'api/v1/users/$', (auth_employee('AllAccess')(UserList.as_view()))),
    url(r'api/v1/coaches/$', (auth_employee_cache(60*15, 'AllAccess','CoachAccess','TeamLeadAccess')(CoachList.as_view())), name='coach-list'),
    url(r'api/v1/coachees/$', coachee_list),
    url(r'api/v1/employees/$', (auth_employee_cache(60*15, 'AllAccess'))(auth_employee('AllAccess')(EmployeeList.as_view())), name='employee-list'),
    url(r'api/v1/employees/(?P<pk>.*)', (auth_employee('AllAccess')(EmployeeDetail.as_view())), name='employee-detail'),
    url(r'api/v1/leaderships/employees/(?P<pk>.*)', (auth_employee('AllAccess')(LeadershipDetail.as_view()))),
    url(r'api/v1/pvp-evaluations/employees/(?P<pk>.*)', (auth_employee('AllAccess')(EmployeePvPEvaluations.as_view()))),
    url(r'^api/v1/pvp-evaluations/', pvp_evaluations),
    url(r'^api/v1/my-team-pvp-evaluations/', my_team_pvp_evaluations),
    url(r'^api/v1/happiness-reports/', happiness_reports),
    url(r'api/v1/engagement/employees/(?P<pk>.*)', (auth_employee('AllAccess')(EmployeeEngagement.as_view()))),
    url(r'api/v1/assessment/employees/(?P<pk>.*)', (auth_employee('AllAccess')(Assessment.as_view()))),
    url(r'api/v1/assessment/mbti/employees/(?P<pk>.*)', (auth_employee('AllAccess')(EmployeeMBTI.as_view()))),
    url(r'api/v1/assessment/mbti/teams/(?P<pk>.*)', (auth('AllAccess')(TeamMBTIReportDetail.as_view()))),
    url(r'^api/v1/team-leads/', team_leads),
    url(r'^api/v1/team-lead-employees/', team_lead_employees),
    url(r'api/v1/team-members/(?P<pk>.*)', (auth_employee('AllAccess')(TeamMemberList.as_view())), name='employee-list'),
    url(r'^api/v1/compensation-summaries/employees/(?P<pk>.*)', (auth_employee('AllAccess')(EmployeeCompensationSummaries.as_view()))),
    url(r'^api/v1/compensation-summaries/', compensation_summaries),
    url(r'api/v1/talent-category-reports/teams/(?P<pk>.*)', (auth_cache(60*15, 'AllAccess'))(auth('AllAccess')(TeamTalentCategoryReportDetail.as_view()))),
    url(r'api/v1/talent-category-reports/lead/(?P<pk>.*)', (auth_employee('AllAccess','TeamLeadAccess')(LeadTalentCategoryReportDetail.as_view()))),
    url(r'api/v1/talent-category-reports/(?P<pk>.*)', (auth_cache(60*15, 'AllAccess'))(auth('AllAccess')(TalentCategoryReportDetail.as_view()))),
    url(r'api/v1/employee-comment-reports/(?P<pk>.*)', (auth_employee('AllAccess')(EmployeeCommentReportDetail.as_view()))),
    url(r'api/v1/employee-engagement-reports/(?P<pk>.*)', (auth_employee('AllAccess')(EmployeeEngagementReportDetail.as_view()))),
    url(r'api/v1/salary-reports/teams/(?P<pk>.*)', (auth_cache(60*15, 'AllAccess'))(auth('AllAccess')(TeamSalaryReportDetail.as_view()))),
    url(r'api/v1/salary-reports/lead/(?P<pk>.*)', (auth_employee('AllAccess','TeamLeadAccess')(LeadSalaryReportDetail.as_view()))),
    url(r'api/v1/salary-reports/company/', get_company_salary_report),
    url(r'api/v1/comments/employees/(?P<pk>.*)', (auth_employee('AllAccess','CoachAccess')(EmployeeCommentList.as_view()))),
    url(r'api/v1/comments/teams/(?P<pk>.*)', (auth('AllAccess')(TeamCommentList.as_view()))),
    url(r'api/v1/comments/leads/(?P<pk>.*)', (auth_employee('AllAccess','TeamLeadAccess')(LeadCommentList.as_view()))),
    url(r'api/v1/comments/subcomments/(?P<pk>.*)', (auth('AllAccess','CoachAccess','TeamLeadAccess')(SubCommentList.as_view()))),
    url(r'api/v1/comments/$', (auth_employee('AllAccess','CoachAccess','TeamLeadAccess')(CommentList.as_view()))),
    url(r'api/v1/comments/(?P<pk>.*)', (auth('AllAccess','CoachAccess','TeamLeadAccess')(CommentDetail.as_view()))),
    url(r'api/v1/tasks/employees/(?P<pk>.*)', (auth_employee('AllAccess','CoachAccess')(EmployeeTaskList.as_view()))),
    url(r'api/v1/tasks/$', (MyTaskList.as_view())),
    url(r'api/v1/tasks/(?P<pk>.*)', (auth_employee('AllAccess','CoachAccess')(TaskDetail.as_view()))),
    url(r'api/v1/image-upload/employees/(?P<pk>.*)', ImageUploadView.as_view()),
    url(r'^', include(router.urls)),
)
