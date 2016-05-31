from django.contrib import admin
from projects.models import *

admin.site.register(Project)
admin.site.register(PrioritizationRule)
admin.site.register(ScoringCategory)
admin.site.register(ScoringCriteria)
admin.site.register(ScoringOption)
