from django.conf.urls import *
from views import *

urlpatterns = [
    #url(r'^selfies/start/$', CreateSelfie.as_view()),
    url(r'^selfies/(?P<pk>[0-9]*)/$', RetrieveUpdateEmployeeZone.as_view()),
]