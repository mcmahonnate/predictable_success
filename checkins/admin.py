from django.contrib import admin
from checkins.models import *

admin.site.register(CheckIn)
admin.site.register(CheckInType)
admin.site.register(CheckInRequest)