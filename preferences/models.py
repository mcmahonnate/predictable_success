from django.db import models
from django.contrib.sites.models import Site

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