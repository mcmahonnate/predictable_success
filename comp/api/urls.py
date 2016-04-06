from django.conf.urls import *
from views import *

urlpatterns = patterns('',
    url(r'^summaries/employees/(?P<pk>[0-9]+)/$', EmployeeCompensationSummaries.as_view()),
    url(r'^summaries/$', compensation_summaries),
)