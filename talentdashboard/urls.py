from django.conf.urls import patterns, include, url
from django.conf.urls.defaults import *
from orgstructure.api import *
from django.contrib import admin
from tastypie.api import Api

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(OrganizationResource())
v1_api.register(EmployeeResource())
v1_api.register(TeamResource())
v1_api.register(MentorshipResource())

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'talentdashboard.views.home', name='home'),
    # url(r'^talentdashboard/', include('talentdashboard.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    url(r'^api/', include(v1_api.urls)),
)
