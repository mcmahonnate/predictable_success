from django.conf import settings
from django.conf.urls import *
from django.contrib import admin
from django.views.generic import TemplateView
from django.contrib.auth.views import password_reset, password_reset_confirm, password_reset_done, password_reset_complete, login, logout
from views.views import *
from views.slack import *
from forms import *
from rest_framework import routers
from views.payment import ChargeView, PaymentView
from views.homepage import IndexView
from org.api.views import Profile
from insights.views import Signup, Report, Survey, Confirmation
from engagement.api.views import RetrieveUpdateDestroyHappiness, CreateHappiness, EmployeeHappinessList
from activity.api.views import EventList, EmployeeEventList, TeamEventList, CoachEventList, LeadEventList, CheckInEventList, CommentEvent
from blah.api.views import CommentDetail
from org.api.views import EmployeeCommentList
router = routers.DefaultRouter()
router.register(r'^api/v1/teams', TeamViewSet)
router.register(r'^api/v1/mentorships', MentorshipViewSet)
router.register(r'^api/v1/leaderships', LeadershipsViewSet)
router.register(r'^api/v1/attributes', AttributeViewSet)

admin.autodiscover()

urlpatterns = [
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
    url(r'^accounts/password/reset/$', password_reset, {'is_admin_site': True, 'template_name': 'password_reset_form.html', 'email_template_name': 'password_reset_email.html'}),
    url(r'^api/v1/annotation-chart/(?P<pk>[0-9]+)/$', AnnotationChartData.as_view()),
    url(r'^api/v1/customer/$', customer),
    url(r'^api/v1/kpi-performance/$', current_kpi_performance),
    url(r'^api/v1/kpi-indicator/$', current_kpi_indicator),
    url(r'^api/v1/user-status/$', user_status),
    url(r'^api/v1/users/$', UserList.as_view()),
    url(r'^api/v1/coaches/$', cache_page(60*1440)(CoachList.as_view()), name='coach-list'),
    url(r'^api/v1/coachees/$', coachee_list),
    url(r'^api/v1/engagement-survey/(?P<pk>.+)/(?P<sid>.+)/$', EngagementSurvey.as_view()),
    url(r'^api/v1/send-engagement-survey/(?P<pk>[0-9]+)/$', SendEngagementSurvey.as_view()),

    url(r'^api/v1/employees/$', (cache_page(60*1440)(EmployeeList.as_view())), name='employee-list'),
    url(r'^api/v1/employees/(?P<pk>[0-9]+)/$', EmployeeDetail.as_view(), name='employee-detail'),
    url(r'^api/v1/employee-names/$', EmployeeNames.as_view(), name='employee-name-list'),
    url(r'^api/v1/leaderships/employees/(?P<pk>[0-9]+)/$', LeadershipDetail.as_view()),
    url(r'^api/v1/pvp-descriptions/$', pvp_descriptions),
    url(r'^api/v1/pvp-evaluations/employees/(?P<pk>[0-9]+)/$', EmployeePvPEvaluations.as_view()),
    url(r'^api/v1/pvp-evaluations/todo/$', pvp_todos),
    url(r'^api/v1/pvp-evaluations/(?P<pk>[0-9]+)/$', PvpEvaluationDetail.as_view()),
    url(r'^api/v1/pvp-evaluations/$', cache_page(60*1440)(pvp_evaluations)),
    url(r'^api/v1/my-team-pvp-evaluations/$', my_team_pvp_evaluations),
    url(r'^api/v1/my-coachees-pvp-evaluations/$', my_coachees_pvp_evaluations),
    url(r'^api/v1/happiness-reports/$', happiness_reports),
    url(r'^api/v1/engagement/employees/(?P<pk>[0-9]+)/$', EmployeeEngagement.as_view()),

    url(r'^api/v1/happiness/employees/(?P<employee_id>[0-9]+)/$', EmployeeHappinessList.as_view()),
    url(r'^api/v1/happiness/(?P<pk>[0-9]+)/$', RetrieveUpdateDestroyHappiness.as_view()),
    url(r'^api/v1/happiness/$', CreateHappiness.as_view()),

    url(r'^api/v1/assessment/employees/(?P<pk>[0-9]+)/$', Assessment.as_view()),
    url(r'^api/v1/assessment/mbti/employees/(?P<pk>[0-9]+)/$', EmployeeMBTI.as_view()),
    url(r'^api/v1/assessment/mbti/teams/(?P<pk>[0-9]+)/$', TeamMBTIReportDetail.as_view()),
    url(r'^api/v1/team-leads/$', cache_page(60*1440)(team_leads)),
    url(r'^api/v1/team-lead-employees/$', team_lead_employees),
    url(r'^api/v1/team-members/(?P<pk>[0-9]+)/$', TeamMemberList.as_view(), name='employee-list'),
    url(r'^api/v1/compensation-summaries/employees/(?P<pk>[0-9]+)/$', EmployeeCompensationSummaries.as_view()),
    url(r'^api/v1/compensation-summaries/$', cache_page(60*1440)(compensation_summaries)),
    url(r'^api/v1/talent-category-reports/teams/(?P<pk>[0-9]+)/$', cache_page(60*1440)(TeamTalentCategoryReportDetail.as_view())),
    url(r'^api/v1/talent-category-reports/lead/$', LeadTalentCategoryReportDetail.as_view()),
    url(r'^api/v1/talent-category-reports/coach/$', CoachTalentCategoryReportDetail.as_view()),
    url(r'^api/v1/talent-category-reports/(?P<pk>[\w\-]+)/$', cache_page(60*1440)(TalentCategoryReportDetail.as_view())),
    url(r'^api/v1/employee-comment-reports/all-employees/$', all_employee_comment_report),
    url(r'^api/v1/employee-engagement-reports/all-employees/$', all_employee_engagement_report),
    url(r'^api/v1/salary-reports/teams/(?P<pk>[0-9]+)/$', cache_page(60*1440)(TeamSalaryReportDetail.as_view())),
    url(r'^api/v1/salary-reports/lead/$', LeadSalaryReportDetail.as_view()),
    url(r'^api/v1/salary-reports/company/$', cache_page(60*1440)(get_company_salary_report)),
    url(r'^api/v1/comments/employees/(?P<pk>[0-9]+)/$', EmployeeCommentList.as_view()),
    url(r'^api/v1/comments/teams/(?P<pk>[0-9]+)/$', TeamCommentList.as_view()),
    url(r'^api/v1/comments/leads/$', LeadCommentList.as_view()),
    url(r'^api/v1/comments/coaches/$', CoachCommentList.as_view()),
    url(r'^api/v1/comments/subcomments/(?P<pk>[0-9]+)/$', SubCommentList.as_view()),
    url(r'^api/v1/comments/$', CommentList.as_view()),
    url(r'^api/v1/comments/(?P<pk>[0-9]+)/$', CommentDetail.as_view()),
    url(r'^api/v1/prospect/$', ProspectDetail.as_view()),
    url(r'^api/v1/prospects/$', ProspectList.as_view()),
    url(r'^api/v1/tasks/mine/$', (MyTaskList.as_view())),
    url(r'^api/v1/tasks/employees/(?P<pk>[0-9]+)/$', EmployeeTaskList.as_view()),
    url(r'^api/v1/tasks/(?P<pk>[0-9]+)?/$', TaskDetail.as_view()),
    url(r'^api/v1/tasks/$', TaskDetail.as_view()),

    url(r'^api/v1/events/employees/(?P<employee_id>[0-9]+)/$', EmployeeEventList.as_view()),
    url(r'^api/v1/events/teams/(?P<pk>[0-9]+)/$', TeamEventList.as_view()),
    url(r'^api/v1/events/leads/$', LeadEventList.as_view()),
    url(r'^api/v1/events/coaches/$', CoachEventList.as_view()),
    url(r'^api/v1/events/checkins/(?P<pk>[0-9]+)/$', CheckInEventList.as_view()),
    url(r'^api/v1/events/$', EventList.as_view()),
    url(r'^api/v1/events/sources/comments/(?P<pk>[0-9]+)/$', CommentEvent.as_view()),

    url(r'^api/v1/image-upload/employees/(?P<pk>[0-9]+)/$', ImageUploadView.as_view()),
    url(r'^api/v1/talent-categories/$', talent_categories),
    url(r'^api/v1/feedback/potential-reviewers/$', potential_reviewers),
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

    url(r'^api/v1/import-data/employee$', upload_employee),
    url(r'^api/v1/import-data/leadership$', upload_leadership),
    url(r'^api/v1/import-data/teams$', upload_teams),

    url(r'^api/v1/reports/comments$', comment_report_timespan),
    url(r'^api/v1/reports/tasks$', task_report_timespan),
    url(r'^api/v1/reports/checkins$', checkin_report_timespan),

    url(r'^api/v1/reports/activity$', last_activity_report),

    url(r'^api/v1/search/', include('search.api.urls')),
    url(r'^api/v1/checkins/', include('checkins.api.urls')),
    url(r'^api/v1/comments/', include('blah.api.urls')),

    url(r'^api/v1/profile/$', Profile.as_view()),

    #url(r'^slack/$', Slack.as_view()),

    url(r'^', include(router.urls)),
]
