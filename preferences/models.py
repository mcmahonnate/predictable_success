from django.db import models
from django.contrib.auth.models import User

class UserPreferences(models.Model):
    DISCUSSION_FOCUSED_DASHBOARD_VIEW = 1
    STATS_FOCUSED_DASHBOARD_VIEW = 2
    DASHBOARD_VIEW_CHOICES = (
        (STATS_FOCUSED_DASHBOARD_VIEW, 'Stats-focused View'),
        (DISCUSSION_FOCUSED_DASHBOARD_VIEW, 'Discussion-focused View'),
    )
    user = models.OneToOneField(User, related_name='preferences')
    dashboard_view = models.IntegerField(choices=DASHBOARD_VIEW_CHOICES, default=DISCUSSION_FOCUSED_DASHBOARD_VIEW)
