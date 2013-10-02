from django.db import models
from org.models import Employee

class EvaluationRound(models.Model):
    date = models.DateField()

    def __str__(self):
        return "%s" % self.date

class PvpEvaluation(models.Model):
    PVP_SCALE = [(i,i) for i in range(1,5)]
    employee = models.ForeignKey(Employee)
    evaluation_round = models.ForeignKey(EvaluationRound)
    potential = models.IntegerField(choices=PVP_SCALE)
    performance = models.IntegerField(choices=PVP_SCALE)

    def is_top_performer(self):
        return self.potential == self.performance == 4

    def is_strong_performer(self):
        return (self.potential == 4 and self.performance == 3) or (self.potential == 3 and self.performance == 4)

    def is_good_performer(self):
        return self.potential == self.performance == 3

    def is_in_wrong_role(self):
        return self.potential >=3 and self.performance < 3

    def lacks_potential(self):
        return self.potential < 3 and self.performance >= 3

    def needs_drastic_change(self):
        return self.potential <=2 and self.performance <= 2

    def __str__(self):
        return "%s PVP Evaluation %s" % (self.employee.informal_name, self.evaluation_round.date)

    class Meta:
        unique_together = ("employee", "evaluation_round")
        verbose_name = "PVP Evaluation"
        verbose_name_plural = "PVP Evaluations"
