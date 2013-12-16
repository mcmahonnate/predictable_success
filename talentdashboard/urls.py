from django.conf import settings
from django.conf.urls import *
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from django.views.decorators.cache import cache_page
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
    url(r'^login/?$','django.contrib.auth.views.login',{'template_name':'login.html', 'authentication_form':CustomAuthenticationForm}),
    url(r'^logout/$', 'django.contrib.auth.views.logout',{'next_page': '/login/'}),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    url(r'^admin/', include(admin.site.urls)),
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
    url(r'api/v1/comments/employees/(?P<pk>.*)', (cache_on_auth(60*15, 'foolsquad'))(group_required('foolsquad')(EmployeeCommentList.as_view()))),
    url(r'api/v1/comments/(?P<pk>.*)', (cache_on_auth(60*15, 'foolsquad'))(group_required('foolsquad')(CommentDetail.as_view()))),
    url(r'^', include(router.urls)),
)
