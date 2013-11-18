from django.conf import settings
from django.conf.urls import *
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from django.views.decorators.cache import cache_page
from views import *
from forms import *
from decorators import *
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
    url(r'^$', login_required(TemplateView.as_view(template_name="index.html")), name='home'),
    url(r'^login/?$','django.contrib.auth.views.login',{'template_name':'login.html', 'authentication_form':CustomAuthenticationForm}),
    url(r'^logout/$', 'django.contrib.auth.views.logout',{'next_page': '/login/'}),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    url(r'^admin/', include(admin.site.urls)),
    url(r'api/v1/employees/$', auth_cache(['foolsquad'], EmployeeList.as_view()), name='employee-list'),
    url(r'api/v1/employees/(?P<pk>.*)', auth_cache(['foolsquad'], EmployeeDetail.as_view()), name='employee-detail'),
    url(r'^api/v1/pvp-evaluations/', auth_cache(['foolsquad'], pvp_evaluations)),
    url(r'^api/v1/team-leads/', auth_cache(['foolsquad'], team_leads)),
    url(r'^api/v1/team-lead-employees/', auth_cache(['foolsquad'], team_lead_employees)),
    url(r'^api/v1/compensation-summaries/', auth_cache(['foolsquad'], compensation_summaries)),
    url(r'api/v1/talent-category-reports/teams/(?P<pk>.*)', auth_cache(['foolsquad'], TeamTalentCategoryReportDetail.as_view())),
    url(r'api/v1/talent-category-reports/(?P<pk>.*)', auth_cache(['foolsquad'], TalentCategoryReportDetail.as_view())),
    url(r'api/v1/salary-reports/teams/(?P<pk>.*)', auth_cache(['foolsquad'], TeamSalaryReportDetail.as_view())),
    url(r'api/v1/salary-reports/company/', auth_cache(['foolsquad'], get_company_salary_report)),
    url(r'api/v1/comments/employees/(?P<pk>.*)', auth_cache(['foolsquad'], EmployeeCommentList.as_view())),
    url(r'api/v1/comments/(?P<pk>.*)', auth_cache(['foolsquad'], CommentDetail.as_view())),
    url(r'^', include(router.urls)),
)
