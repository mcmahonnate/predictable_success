from django.conf.urls import *
from views import *

urlpatterns = [
    url(r'^coaches/available/$', available_coaches, name='available-coaches'),
    url(r'^coaches/change/$', change_coach, name='change-coach'),
    url(r'^coaches/current/$', CurrentCoach.as_view(), name='my-coach'),
]
