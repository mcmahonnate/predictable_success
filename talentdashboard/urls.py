from django.conf import settings
from django.conf.urls import *
from django.contrib import admin
from django.views.generic import TemplateView
from django.contrib.auth.views import password_reset, password_reset_confirm, password_reset_done, password_reset_complete, login, logout
from views.views import *
from search.views import employee_search, talent_report, my_team_report, my_coachees_report, my_team_employee_search, my_coachees_employee_search
from forms import *
from rest_framework import routers
from views.payment import ChargeView, PaymentView
from views.homepage import IndexView
from insights.views import Signup, Report, Survey, Confirmation

router = routers.DefaultRouter()
router.register(r'^api/v1/teams', TeamViewSet)
router.register(r'^api/v1/mentorships', MentorshipViewSet)
router.register(r'^api/v1/leaderships', LeadershipsViewSet)
router.register(r'^api/v1/attributes', AttributeViewSet)

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', IndexView.as_view(), name='index'),
	url(r'^404/?$', TemplateView.as_view(template_name="404.html"), name='404'),
	url(r'^error/?$', TemplateView.as_view(template_name="error.html"), name='error'),
    url(r'^confirmation/?$', TemplateView.as_view(template_name="confirmation.html"), name='confirmation'),
    url(r'^feedback/$', TemplateView.as_view(template_name="feedback.html"), name='feedback_home'),
    url(r'^logout/$', logout,{'next_page': '/account/login/'}),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^account/payment/?$', PaymentView.as_view(), name='payment'),
    url(r'^account/thanks/?$',ChargeView.as_view(), name='charge'),
    url(r'^account/login/?$',login,{'template_name':'login.html', 'authentication_form':CustomAuthenticationForm}, name='login'),
    url(r'^account/password_reset/done/$', password_reset_done, {'template_name': 'password_reset_done.html'}),
    url(r'^account/reset/(?P<uidb64>[0-9A-Za-z]+)/(?P<token>.+)/$', password_reset_confirm, {'template_name': 'password_reset_confirm.html', 'set_password_form':CustomSetPasswordForm}),
    url(r'^account/reset/complete/$', password_reset_complete, {'template_name': 'password_reset_complete.html'}),
    url(r'^account/reset/done/$', password_reset_complete, {'template_name': 'password_reset_complete.html'}),
    url(r'^account/', include('django.contrib.auth.urls')),
    url(r'^accounts/password/reset/$', password_reset, {'template_name': 'password_reset_form.html', 'email_template_name': 'password_reset_email.html'}),
    url(r'^api/v1/annotation-chart/(?P<pk>[0-9]+)/$', AnnotationChartData.as_view()),
    url(r'^api/v1/customer/$', customer),
    url(r'^api/v1/kpi-performance/$', current_kpi_performance),
    url(r'^api/v1/kpi-indicator/$', current_kpi_indicator),
    url(r'^api/v1/user-status/$', user_status),
    url(r'^api/v1/users/$', (auth_employee('AllAccess')(UserList.as_view()))),
    url(r'^api/v1/coaches/$', (auth_employee_cache(60*1440, 'AllAccess','CoachAccess','TeamLeadAccess')(CoachList.as_view())), name='coach-list'),
    url(r'^api/v1/coachees/$', coachee_list),
    url(r'^api/v1/engagement-survey/(?P<pk>.+)/(?P<sid>.+)/$', EngagementSurvey.as_view()),
    url(r'^api/v1/send-engagement-survey/(?P<pk>[0-9]+)/$', SendEngagementSurvey.as_view()),
    url(r'^api/v1/employees/$', (auth_employee_cache(60*1440, 'AllAccess'))(auth_employee('AllAccess')(EmployeeList.as_view())), name='employee-list'),
    url(r'^api/v1/employees/potential-reviewers/$', potential_reviewers),
    url(r'^api/v1/employees/(?P<pk>[0-9]+)/$', (auth_employee('AllAccess')(EmployeeDetail.as_view())), name='employee-detail'),
    url(r'^api/v1/employee-names/$', (auth_employee('AllAccess')(EmployeeNames.as_view())), name='employee-name-list'),
    url(r'^api/v1/leaderships/employees/(?P<pk>[0-9]+)/$', (auth_employee('AllAccess')(LeadershipDetail.as_view()))),
    url(r'^api/v1/pvp-descriptions/$', pvp_descriptions),
    url(r'^api/v1/pvp-evaluations/employees/(?P<pk>[0-9]+)/$', (auth_employee('AllAccess')(EmployeePvPEvaluations.as_view()))),
    url(r'^api/v1/pvp-evaluations/todo/$', pvp_todos),
    url(r'^api/v1/pvp-evaluations/(?P<pk>[0-9]+)/$', PvpEvaluationDetail.as_view()),
    url(r'^api/v1/pvp-evaluations/$', pvp_evaluations),
    url(r'^api/v1/my-team-pvp-evaluations/$', my_team_pvp_evaluations),
    url(r'^api/v1/my-coachees-pvp-evaluations/$', my_coachees_pvp_evaluations),
    url(r'^api/v1/happiness-reports/$', happiness_reports),
    url(r'^api/v1/engagement/employees/(?P<pk>[0-9]+)/$', (auth_employee('AllAccess')(EmployeeEngagement.as_view()))),
    url(r'^api/v1/assessment/employees/(?P<pk>[0-9]+)/$', (auth_employee('AllAccess')(Assessment.as_view()))),
    url(r'^api/v1/assessment/mbti/employees/(?P<pk>[0-9]+)/$', (auth_employee('AllAccess')(EmployeeMBTI.as_view()))),
    url(r'^api/v1/assessment/mbti/teams/(?P<pk>[0-9]+)/$', (auth('AllAccess')(TeamMBTIReportDetail.as_view()))),
    url(r'^api/v1/team-leads/$', team_leads),
    url(r'^api/v1/team-lead-employees/$', team_lead_employees),
    url(r'^api/v1/team-members/(?P<pk>[0-9]+)/$', (auth_employee('AllAccess')(TeamMemberList.as_view())), name='employee-list'),
    url(r'^api/v1/compensation-summaries/employees/(?P<pk>[0-9]+)/$', (auth_employee('AllAccess')(EmployeeCompensationSummaries.as_view()))),
    url(r'^api/v1/compensation-summaries/$', compensation_summaries),
    url(r'^api/v1/talent-category-reports/teams/(?P<pk>[0-9]+)/$', (auth_cache(60*1440, 'AllAccess'))(auth('AllAccess')(TeamTalentCategoryReportDetail.as_view()))),
    url(r'^api/v1/talent-category-reports/lead/$', (auth_employee('AllAccess','TeamLeadAccess')(LeadTalentCategoryReportDetail.as_view()))),
    url(r'^api/v1/talent-category-reports/coach/$', (auth_employee('AllAccess','CoachAccess')(CoachTalentCategoryReportDetail.as_view()))),
    url(r'^api/v1/talent-category-reports/(?P<pk>[\w\-]+)/$', (auth_cache(60*1440, 'AllAccess'))(auth('AllAccess')(TalentCategoryReportDetail.as_view()))),
    url(r'^api/v1/employee-comment-reports/all-employees/$', (auth_employee('AllAccess')(all_employee_comment_report))),
    url(r'^api/v1/employee-engagement-reports/all-employees/$', (auth_employee('AllAccess')(all_employee_engagement_report))),
    url(r'^api/v1/salary-reports/teams/(?P<pk>[0-9]+)/$', (auth_cache(60*1440, 'AllAccess'))(auth('AllAccess')(TeamSalaryReportDetail.as_view()))),
    url(r'^api/v1/salary-reports/lead/$', (auth_employee('AllAccess','TeamLeadAccess')(LeadSalaryReportDetail.as_view()))),
    url(r'^api/v1/salary-reports/company/$', get_company_salary_report),
    url(r'^api/v1/comments/employees/(?P<pk>[0-9]+)/$', (auth_employee('AllAccess','CoachAccess', 'EvaluateAccess')(EmployeeCommentList.as_view()))),
    url(r'^api/v1/comments/teams/(?P<pk>[0-9]+)/$', (auth('AllAccess')(TeamCommentList.as_view()))),
    url(r'^api/v1/comments/leads/$', (auth_employee('AllAccess','TeamLeadAccess')(LeadCommentList.as_view()))),
    url(r'^api/v1/comments/coaches/$', (auth_employee('AllAccess','CoachAccess')(CoachCommentList.as_view()))),
    url(r'^api/v1/comments/subcomments/(?P<pk>[0-9]+)/$', (auth('AllAccess','CoachAccess','TeamLeadAccess')(SubCommentList.as_view()))),
    url(r'^api/v1/comments/$', (auth_employee('AllAccess','CoachAccess','TeamLeadAccess')(CommentList.as_view()))),
    url(r'^api/v1/comments/(?P<pk>[0-9]+)/$', (auth('AllAccess','CoachAccess','TeamLeadAccess')(CommentDetail.as_view()))),
    url(r'^api/v1/prospect/$', (auth_employee('AllAccess','CoachAccess','TeamLeadAccess')(ProspectDetail.as_view()))),
    url(r'^api/v1/prospects/$', (auth_employee('AllAccess','CoachAccess','TeamLeadAccess')(ProspectList.as_view()))),
    url(r'^api/v1/tasks/mine/$', (MyTaskList.as_view())),
    url(r'^api/v1/tasks/employees/(?P<pk>[0-9]+)/$', (auth_employee('AllAccess','CoachAccess','TeamLeadAccess')(EmployeeTaskList.as_view()))),
    url(r'^api/v1/tasks/(?P<pk>[0-9]+)?/$', (auth('AllAccess','CoachAccess','TeamLeadAccess')(TaskDetail.as_view()))),
    url(r'^api/v1/tasks/$', (auth('AllAccess','CoachAccess','TeamLeadAccess')(TaskDetail.as_view()))),

    url(r'^api/v1/image-upload/employees/(?P<pk>[0-9]+)/$', ImageUploadView.as_view()),
    url(r'^api/v1/talent-categories/$', talent_categories),
    url(r'^api/v1/feedback/requests/todo/$', incomplete_feedback_requests_for_reviewer),
    url(r'^api/v1/feedback/requests/pending/$', incomplete_feedback_requests_for_requester),
    url(r'^api/v1/feedback/requests/(?P<pk>[0-9]*)/$', FeedbackRequestView.as_view()),
    url(r'^api/v1/feedback/submissions/confidentiality-options/$', confidentiality_options),
    url(r'^api/v1/feedback/submissions/mine/$', my_feedback),
    url(r'^api/v1/feedback/submissions/read/$', mark_feedback_read),
    url(r'^api/v1/feedback/submissions/deliver/$', mark_feedback_delivered),
    url(r'^api/v1/feedback/submissions/(?P<pk>[0-9]*)/$', FeedbackSubmissionView.as_view()),
    url(r'^api/v1/feedback/coachees/$', get_coachees_feedback_report),
    url(r'^api/v1/feedback/coachees/(?P<pk>[0-9]*)/$', view_coachee_feedback),
    url(r'^api/v1/feedback/submissions/mine/$', my_feedback),
    url(r'^api/v1/feedback/menu/$', menu_counts),
    
    url(r'^insights/$', Signup.as_view(), name="signup"),
    url(r'^insights/report/(?P<access_token>[\w.@+-]+)/(?P<uid>[\w.@+-]+)/$', Report.as_view(), name="insights_survey_report"),
    url(r'^insights/survey/(?P<access_token>[\w.@+-]+)/$', Survey.as_view(), name="insights_survey"),
    url(r'^insights/thanks/$', Confirmation.as_view(), name="insights_confirmation"),
    
    url(r'^api/v1/reports/talent/my-team/$', my_team_report),
    url(r'^api/v1/reports/talent/my-coachees/$', my_coachees_report),
    url(r'^api/v1/reports/talent/$', talent_report),

    url(r'^api/v1/search/employees/$', employee_search),
    url(r'^api/v1/search/employees/my-team/$', my_team_employee_search),
    url(r'^api/v1/search/employees/my-coachees/$', my_coachees_employee_search),

    url(r'^api/v1/import-data/employee$', upload_employee),
    url(r'^api/v1/import-data/leadership$', upload_leadership),
    url(r'^api/v1/import-data/teams$', upload_teams),
    url(r'^', include(router.urls)),
)
