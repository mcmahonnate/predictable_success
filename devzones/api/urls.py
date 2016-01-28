from django.conf.urls import *
from views import *

urlpatterns = [
    url(r'^selfies/start/$', CreateEmployeeZone.as_view()),
    url(r'^selfies/(?P<pk>[0-9]*)/$', RetrieveEmployeeZone.as_view()),
    url(r'^selfies/(?P<pk>[0-9]+)/update/$', UpdateEmployeeZone.as_view()),
]