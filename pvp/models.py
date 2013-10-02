from django.db import models
from org.models import Employee

class EvaluationRound(models.Model):
    date = models.DateField()

    def __str__(self):
        return "%s" % self.date

class PvpEvaluation(models.Model):
    PVP_SCALE = [(i,i) for i in range(1,5)]
    TOP_PERFORMER = 1
    STRONG_PERFORMER = 2
    GOOD_PERFORMER = 3
    WRONG_ROLE = 4
    LACKS_POTENTIAL = 5
    NEEDS_DRASTIC_CHANGE = 6

    employee = models.ForeignKey(Employee)
    evaluation_round = models.ForeignKey(EvaluationRound)
    potential = models.IntegerField(choices=PVP_SCALE)
    performance = models.IntegerField(choices=PVP_SCALE)

    def get_summary_score(self):
        if self.__is_top_performer():
            return self.TOP_PERFORMER
        if self.__is_strong_performer():
            return self.STRONG_PERFORMER
        if self.__is_good_performer():
            return self.GOOD_PERFORMER
        if self.__is_in_wrong_role():
            return self.WRONG_ROLE
        if self.__lacks_potential():
            return self.LACKS_POTENTIAL
        if self.__needs_drastic_change():
            return self.NEEDS_DRASTIC_CHANGE

    def __is_top_performer(self):
        return self.potential == self.performance == 4

    def __is_strong_performer(self):
        return (self.potential == 4 and self.performance == 3) or (self.potential == 3 and self.performance == 4)

    def __is_good_performer(self):
        return self.potential == self.performance == 3

    def __is_in_wrong_role(self):
        return self.potential >=3 and self.performance < 3

    def __lacks_potential(self):
        return self.potential < 3 and self.performance >= 3

    def __needs_drastic_change(self):
        return self.potential <=2 and self.performance <= 2

    def __str__(self):
        return "%s PVP Evaluation %s" % (self.employee.informal_name, self.evaluation_round.date)

    class Meta:
        unique_together = ("employee", "evaluation_round")
        verbose_name = "PVP Evaluation"
        verbose_name_plural = "PVP Evaluations"
