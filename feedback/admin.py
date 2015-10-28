from django.contrib import admin
from feedback.models import *

admin.site.register(FeedbackRequest)
admin.site.register(FeedbackSubmission)
admin.site.register(FeedbackDigest)
