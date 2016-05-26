from django.contrib import admin
from activity.models import *

admin.site.register(Event)
admin.site.register(ThirdParty)
admin.site.register(ThirdPartyEvent)