from django.db import models
from django.contrib.sites.models import Site

class SitePreferences(models.Model):
    site = models.OneToOneField(Site,on_delete=models.SET_NULL, null=True, blank=True)
    show_kolbe = models.BooleanField()
    show_vops = models.BooleanField()
    show_mbti = models.BooleanField()
    show_coaches = models.BooleanField()

    def __str__(self):
        return "show kolbe: %s, show vops: %s, show mbti: %s" % (self.show_kolbe, self.show_vops, self.show_mbti)