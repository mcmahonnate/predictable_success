from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.defaults import *
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from views import *
from forms import *
from rest_framework import routers
from blah.models import Comment

router = routers.DefaultRouter()
router.register(r'api/v1/employees', EmployeeViewSet)
router.register(r'api/v1/teams', TeamViewSet)
router.register(r'api/v1/mentorships', MentorshipViewSet)
router.register(r'api/v1/leadership', LeadershipViewSet)

admin.site.register(Comment)
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', login_required(TemplateView.as_view(template_name="index.html")), name='home'),
    url(r'^login/?$','django.contrib.auth.views.login',{'template_name':'login.html', 'authentication_form':CustomAuthenticationForm}),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/v1/pvp-evaluations/', pvp_evaluations),
    url(r'^api/v1/compensation-summaries/', compensation_summaries),
    url(r'api/v1/talent-category-reports/teams/(?P<pk>.*)', TeamTalentCategoryReportDetail.as_view()),
    url(r'api/v1/talent-category-reports/(?P<pk>.*)', TalentCategoryReportDetail.as_view()),
    url(r'api/v1/salary-reports/teams/(?P<pk>.*)', TeamSalaryReportDetail.as_view()),
    url(r'api/v1/salary-reports/company/', get_company_salary_report),
    url(r'api/v1/comments/employees/(?P<pk>.*)', EmployeeCommentList.as_view()),
    url(r'api/v1/comments/(?P<pk>.*)', CommentDetail.as_view()),
    url(r'^', include(router.urls)),
)
