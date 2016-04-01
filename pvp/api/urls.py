from django.conf.urls import *
from django.views.decorators.cache import cache_page
from views import *

urlpatterns = patterns('',
    url(r'^annotation-chart/(?P<pk>[0-9]+)/$', AnnotationChartData.as_view()),
    url(r'^descriptions/$', pvp_descriptions),
    url(r'^evaluations/employees/(?P<pk>[0-9]+)/$', EmployeePvPEvaluations.as_view()),
    url(r'^evaluations/todo/$', pvp_todos),
    url(r'^evaluations/(?P<pk>[0-9]+)/$', PvpEvaluationDetail.as_view()),
    url(r'^evaluations/$', cache_page(60*1440)(pvp_evaluations)),
)
