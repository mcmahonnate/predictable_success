from django.conf.urls import patterns, include, url
from django.conf.urls.defaults import *
from orgstructure.api import *
from compensationtracking.api import *
from django.contrib import admin
from tastypie.api import Api
from django.views.generic import TemplateView

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(OrganizationResource())
v1_api.register(EmployeeResource())
v1_api.register(TeamResource())
v1_api.register(MentorshipResource())
v1_api.register(CompensationSummaryResource())

urlpatterns = patterns('',
    url(r'^$',  TemplateView.as_view(template_name="index.html"), name='home'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(v1_api.urls)),
)
