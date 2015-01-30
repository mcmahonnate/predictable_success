from django.contrib.auth.models import User
from django.db import models
from django.db.models.query import QuerySet
from org.models import Employee


class EvaluationRoundManager(models.Manager):
    def most_recent(self, is_complete=True):
        return self.filter(is_complete=is_complete).order_by('-date')[0:1].get()


class EvaluationRound(models.Model):
    date = models.DateField()
    is_complete = models.BooleanField()
    objects = EvaluationRoundManager()

    def __str__(self):
        return "%s" % self.date


class PvpEvaluationManager(models.Manager):
    def get_evaluations_for_round(self, round_id):
        return self.filter(evaluation_round__id=round_id)

    def get_evaluations_for_team(self, team_id, round_id):
        return self.filter(evaluation_round__id=round_id, employee__team__id=team_id)

    def current_for_user(self, user):
        current_round = EvaluationRound.objects.most_recent()
        return self.filter(evaluation_round=current_round).filter(evaluator=user)

    def todos_for_user(self, user):
        current_round = EvaluationRound.objects.most_recent(is_complete=False)
        return self.filter(evaluation_round=current_round).filter(evaluator=user).filter(is_complete=False)


class PvpEvaluation(models.Model):
    PVP_SCALE = [(i,i) for i in range(0,5)]
    TOP_PERFORMER = 1
    STRONG_PERFORMER = 2
    GOOD_PERFORMER = 3
    LACKS_POTENTIAL = 4
    WRONG_ROLE = 5
    NEEDS_DRASTIC_CHANGE = 6
    SUMMARY_SCORE_SCALE = [TOP_PERFORMER, STRONG_PERFORMER, GOOD_PERFORMER, LACKS_POTENTIAL, WRONG_ROLE, NEEDS_DRASTIC_CHANGE]

    objects = PvpEvaluationManager()
    employee = models.ForeignKey(Employee, related_name='pvp')
    evaluation_round = models.ForeignKey(EvaluationRound)
    potential = models.IntegerField(choices=PVP_SCALE, blank=True, default=0)
    performance = models.IntegerField(choices=PVP_SCALE, blank=True, default=0)
    evaluator = models.ForeignKey(User, null=True, blank=True)
    is_complete = models.BooleanField()

    def save(self, *args, **kwargs):
        self.is_complete = self.performance > 0 and self.potential > 0
        super(PvpEvaluation, self).save(*args, **kwargs)

    def complete(self, potential, performance, evaluator=None):
        self.evaluator = evaluator
        self.potential = potential
        self.performance = performance

    def get_talent_category(self):
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
        return 0

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
        return self.potential <=2 and self.performance <= 2 and (self.potential + self.performance) > 0

    def __str__(self):
        return "%s PVP Evaluation %s" % (self.employee.full_name, self.evaluation_round.date)

    class Meta:
        unique_together = ("employee", "evaluation_round")
        verbose_name = "PVP Evaluation"
        verbose_name_plural = "PVP Evaluations"
        ordering =['-evaluation_round__date',]
