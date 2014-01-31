from django.conf import settings
from django.conf.urls import *
from django.contrib import admin
from django.views.generic import TemplateView
from django.contrib.auth.views import password_reset, password_reset_confirm, password_reset_done, password_reset_complete, login, logout
from views import *
from forms import *
from rest_framework import routers
from blah.models import Comment

router = routers.DefaultRouter()
router.register(r'api/v1/teams', TeamViewSet)
router.register(r'api/v1/mentorships', MentorshipViewSet)
router.register(r'api/v1/leaderships', LeadershipViewSet)
router.register(r'api/v1/attributes', AttributeViewSet)

admin.site.register(Comment)
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
    url(r'api/v1/user-status/$', user_status),
    url(r'api/v1/users/$', (group_required('foolsquad')(UserList.as_view()))),
    url(r'api/v1/coaches/$', (cache_on_auth(60*15, 'foolsquad'))(group_required('foolsquad')(CoachList.as_view())), name='coach-list'),
    url(r'api/v1/employees/$', (cache_on_auth(60*15, 'foolsquad'))(group_required('foolsquad')(EmployeeList.as_view())), name='employee-list'),
    url(r'api/v1/employees/(?P<pk>.*)', (cache_on_auth(60*15, 'foolsquad'))(group_required('foolsquad')(EmployeeDetail.as_view())), name='employee-detail'),
    url(r'^api/v1/pvp-evaluations/', pvp_evaluations),
    url(r'^api/v1/team-leads/', team_leads),
    url(r'^api/v1/team-lead-employees/', team_lead_employees),
    url(r'^api/v1/compensation-summaries/', compensation_summaries),
    url(r'api/v1/talent-category-reports/teams/(?P<pk>.*)', (cache_on_auth(60*15, 'foolsquad'))(group_required('foolsquad')(TeamTalentCategoryReportDetail.as_view()))),
    url(r'api/v1/talent-category-reports/(?P<pk>.*)', (cache_on_auth(60*15, 'foolsquad'))(group_required('foolsquad')(TalentCategoryReportDetail.as_view()))),
    url(r'api/v1/salary-reports/teams/(?P<pk>.*)', (cache_on_auth(60*15, 'foolsquad'))(group_required('foolsquad')(TeamSalaryReportDetail.as_view()))),
    url(r'api/v1/salary-reports/company/', get_company_salary_report),
    url(r'api/v1/comments/employees/(?P<pk>.*)', (group_required('foolsquad')(EmployeeCommentList.as_view()))),
    url(r'api/v1/comments/subcomments/(?P<pk>.*)', (group_required('foolsquad')(SubCommentList.as_view()))),
    url(r'api/v1/comments/$', (group_required('foolsquad')(CommentList.as_view()))),
    url(r'api/v1/comments/(?P<pk>.*)', (group_required('foolsquad')(CommentDetail.as_view()))),
    url(r'api/v1/tasks/employees/(?P<pk>.*)', (group_required('foolsquad')(EmployeeTaskList.as_view()))),
    url(r'api/v1/tasks/$', (group_required('foolsquad')(MyTaskList.as_view()))),
    url(r'api/v1/tasks/(?P<pk>.*)', (group_required('foolsquad')(TaskDetail.as_view()))),
    url(r'^', include(router.urls)),
)
