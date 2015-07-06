from django.db import models
from org.models import Employee
from blah.models import Comment
from django.core.signing import Signer

HAPPINESS_CHOICES = (
    (0, 'Not assessed'),
    (1, 'Very unhappy'),
    (2, 'Unhappy'),
    (3, 'Indifferent'),
    (4, 'Happy'),
    (5, 'Very happy'),
)


class Happiness(models.Model):
    assessed_by = models.ForeignKey(Employee, related_name='+')
    assessed_date = models.DateTimeField(auto_now_add = True)
    employee = models.ForeignKey(Employee, related_name='happys')
    assessment = models.IntegerField(choices=HAPPINESS_CHOICES, default=0)
    comment = models.ForeignKey(Comment, null=True, blank=True)

    def assessment_verbose(self):
        return get_display(self.assessment, HAPPINESS_CHOICES)

    def __str__(self):
        return "On %s %s was %s" % (self.assessed_date, self.employee.full_name, get_display(self.assessment, HAPPINESS_CHOICES))

class SurveyUrl(models.Model):
    sent_from = models.ForeignKey(Employee, null=True, related_name='+')
    sent_to = models.ForeignKey(Employee, related_name='+')
    url = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )
    active = models.BooleanField(default=True)
    completed = models.BooleanField(default=False)
    sent_date = models.DateField(auto_now_add = True)

    def __str__(self):
        return "%s was sent an engagement survey on %s" % (self.sent_to, self.sent_date)

def generate_survey(employee, sent_from, customer):
    survey = SurveyUrl()
    survey.sent_to = employee
    survey.sent_from = sent_from
    survey.save()
    signer = Signer()
    signed_uid = signer.sign(employee.id)
    signed_id = signer.sign(survey.id)
    site = customer.domain_url
    url = 'http://' + site + '/#/engagement-survey/' + signed_uid + '/' + signed_id
    survey.url = url
    survey.save()

    return survey

def get_display(key, list):
    d = dict(list)
    if key in d:
        return d[key]
    return None