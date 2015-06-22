from django.db import models
from django.contrib.sites.models import Site
from django.contrib.auth.models import User


class SitePreferences(models.Model):
    site = models.OneToOneField(Site,on_delete=models.SET_NULL, null=True, blank=True)
    show_kolbe = models.BooleanField(default=False)
    show_vops = models.BooleanField(default=False)
    show_mbti = models.BooleanField(default=False)
    show_coaches = models.BooleanField(default=False)
    show_timeline = models.BooleanField(default=False)
    survey_email_subject = models.CharField(
        max_length=255,
        blank=True,
    )
    survey_email_body = models.TextField()

    def __str__(self):
        return "show kolbe: %s, show vops: %s, show mbti: %s" % (self.show_kolbe, self.show_vops, self.show_mbti)


class UserPreferences(models.Model):
    DISCUSSION_FOCUSED_DASHBOARD_VIEW = 1
    STATS_FOCUSED_DASHBOARD_VIEW = 2
    DASHBOARD_VIEW_CHOICES = (
        (STATS_FOCUSED_DASHBOARD_VIEW, 'Stats-focused View'),
        (DISCUSSION_FOCUSED_DASHBOARD_VIEW, 'Discussion-focused View'),
    )
    user = models.OneToOneField(User, related_name='preferences')
    dashboard_view = models.IntegerField(choices=DASHBOARD_VIEW_CHOICES, default=DISCUSSION_FOCUSED_DASHBOARD_VIEW)
