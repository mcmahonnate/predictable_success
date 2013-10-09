from django.conf.urls import patterns, include, url
from django.conf.urls.defaults import *
from django.contrib import admin
from django.views.generic import TemplateView
from tastypie.api import Api
from org.api import *
from pvp.api import *
from comp.api import *
from views import *
from rest_framework import routers
router = routers.DefaultRouter()
router.register(r'api/v1/employees', EmployeeViewSet)
router.register(r'api/v1/teams', TeamViewSet)
router.register(r'api/v1/mentorships', MentorshipViewSet)
admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(CompensationSummaryResource())
v1_api.register(PvpEvaluationResource())
v1_api.register(EvaluationRoundResource())
v1_api.register(AllEmployeesTalentCategoryReportResource())
v1_api.register(TeamTalentCategoryReportResource())

urlpatterns = patterns('',
    url(r'^$',  TemplateView.as_view(template_name="index.html"), name='home'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/v1/pvp/evaluations/current/', current_pvp_evaluations),
    url(r'^', include(router.urls)),
    url(r'^api/', include(v1_api.urls)),
)
