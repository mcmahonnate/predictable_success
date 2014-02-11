from django.db import models
from org.models import Employee

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
    employee = models.ForeignKey(Employee, related_name='+')
    assessment = models.IntegerField(choices=HAPPINESS_CHOICES)

    def assessment_verbose(self):
        return get_display(self.assessment, HAPPINESS_CHOICES)

    def __str__(self):
        return "On %s %s was %s" % (self.assessed_date, self.employee.full_name, get_display(self.assessment, HAPPINESS_CHOICES))

def get_display(key, list):
    d = dict(list)
    if key in d:
        return d[key]
    return None