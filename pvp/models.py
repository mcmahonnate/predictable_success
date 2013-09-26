from django.db import models
from org.models import Employee
from org.models import Organization

class EvaluationRound(models.Model):
    organization = models.ForeignKey(Organization)
    date = models.DateField()

class PvpEvaluation(models.Model):
    PVP_SCALE = [(i,i) for i in range(1,5)]
    employee = models.ForeignKey(Employee)
    round = models.ForeignKey(EvaluationRound)
    potential = models.IntegerField(choices=PVP_SCALE)
    performance = models.IntegerField(choices=PVP_SCALE)

    def __str__(self):
        return "%s PVP Evaluation %s" % (self.employee.informal_name, self.date)

    class Meta:
        unique_together = ("employee", "date")
        verbose_name = "PVP Evaluation"
        verbose_name_plural = "PVP Evaluations"
