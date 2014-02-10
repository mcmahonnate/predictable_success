from django.db import models
from org.models import Employee

class Happiness(models.Model):
    assessed_by = models.ForeignKey(Employee, related_name='+')
    assessed_date = models.DateField(auto_now_add = True)
    employee = models.ForeignKey(Employee, related_name='+')
    HAPPINESS_CHOICES = (
        (1, 'Very unhappy'),
        (2, 'Unhappy'),
        (3, 'Indifferent'),
        (4, 'Happy'),
        (5, 'Very happy'),
    )
    assessment = models.IntegerField(choices=HAPPINESS_CHOICES)

    def __str__(self):
        return "On %s %s was %s" % (self.assessed_date, self.employee.full_name, self.assessment.name)