from django.db import models
from org.models import Employee
from blah.models import Comment
from django.core.signing import Signer
from django.contrib.sites.models import get_current_site

HAPPINESS_CHOICES = (
    (1, 'Very unhappy'),
    (2, 'Unhappy'),
    (3, 'Indifferent'),
    (4, 'Happy'),
    (5, 'Very happy'),
)

class Happiness(models.Model):
    assessed_by = models.ForeignKey(Employee, related_name='+')
    assessed_date = models.DateField(auto_now_add = True)
    employee = models.ForeignKey(Employee, related_name='happys')
    assessment = models.IntegerField(choices=HAPPINESS_CHOICES)
    comment = models.ForeignKey(Comment, null=True, blank=True)

    def assessment_verbose(self):
        return get_display(self.assessment, HAPPINESS_CHOICES)

    def __str__(self):
        return "On %s %s was %s" % (self.assessed_date, self.employee.full_name, get_display(self.assessment, HAPPINESS_CHOICES))

class SurveyUrl(models.Model):
    sent_to = models.ForeignKey(Employee, related_name='+')
    url = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )
    active = models.BooleanField(default=True)
    sent_date = models.DateField(auto_now_add = True)

    def __str__(self):
        return "%s was sent an engagement survey on %s" % (self.sent_to, self.sent_date)

def generate_survey_url(employee):
    survey = SurveyUrl()
    survey.sent_to = employee
    survey.save()
    signer = Signer()
    signed_uid = signer.sign(employee.id)
    signed_id = signer.sign(survey.id)
    site = get_current_site(None).domain
    url = 'http://' + site + '/#/engagement-survey/' + signed_uid + '/' + signed_id
    survey.url = url
    survey.save()

    return survey

def get_display(key, list):
    d = dict(list)
    if key in d:
        return d[key]
    return None