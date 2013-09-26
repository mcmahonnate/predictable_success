from django.conf.urls import patterns, include, url
from django.conf.urls.defaults import *
from org.api import *
from pvp.api import *
from comp.api import *
from django.contrib import admin
from tastypie.api import Api
from django.views.generic import TemplateView

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(EmployeeResource())
v1_api.register(TeamResource())
v1_api.register(MentorshipResource())
v1_api.register(CompensationSummaryResource())
v1_api.register(PvpEvaluationResource())
v1_api.register(EvaluationRoundResource())

urlpatterns = patterns('',
    url(r'^$',  TemplateView.as_view(template_name="index.html"), name='home'),
    url(r'^employees/(?P<id>\d+)$',  TemplateView.as_view(template_name="employee.html"), name='employee'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(v1_api.urls)),
)
