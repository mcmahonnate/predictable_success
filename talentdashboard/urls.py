from django.conf.urls import patterns, include, url
from django.conf.urls.defaults import *
from django.contrib import admin
from django.views.generic import TemplateView
from views import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'api/v1/employees', EmployeeViewSet)
router.register(r'api/v1/teams', TeamViewSet)
router.register(r'api/v1/mentorships', MentorshipViewSet)

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$',  TemplateView.as_view(template_name="index.html"), name='home'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/v1/pvp-evaluations/', pvp_evaluations),
    url(r'^api/v1/compensation-summaries/', compensation_summaries),
    url(r'api/v1/talent-category-reports/teams/(?P<pk>.*)', TeamTalentCategoryReportDetail.as_view()),
    url(r'api/v1/talent-category-reports/(?P<pk>.*)', TalentCategoryReportDetail.as_view()),
    url(r'^', include(router.urls)),
)
