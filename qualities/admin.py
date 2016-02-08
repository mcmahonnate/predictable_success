from django.contrib import admin
from .models import *

admin.site.register(Quality)
admin.site.register(QualityCluster)
admin.site.register(PerceivedQuality)
admin.site.register(PerceptionRequest)
