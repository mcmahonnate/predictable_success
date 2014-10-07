from django.contrib import admin
from assessment.models import *

admin.site.register(AssessmentType)
admin.site.register(AssessmentCategory)
admin.site.register(AssessmentBand)
admin.site.register(EmployeeAssessment)
admin.site.register(AssessmentComparison)
admin.site.register(MBTI)
admin.site.register(MBTIEmployeeDescriptions)
admin.site.register(MBTITeamDescriptions)