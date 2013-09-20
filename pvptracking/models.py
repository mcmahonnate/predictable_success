from django.db import models
from orgstructure.models import Employee

class PvpEvaluation(models.Model):
    PVP_SCALE = [(i,i) for i in range(5)]
    employee = models.ForeignKey(Employee)
    date = models.DateField()
    potential = models.IntegerField(choices=PVP_SCALE)
    performance = models.IntegerField(choices=PVP_SCALE)
