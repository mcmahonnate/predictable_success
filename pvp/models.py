from django.contrib.auth.models import User
from django.db import models
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from org.models import Employee
from blah.models import Comment
from django.utils.log import getLogger
from django.db.models import Max, F, Q

logger = getLogger('talentdashboard')
PVP_SCALE = [(i, i) for i in range(0, 5)]


class EvaluationRoundManager(models.Manager):
    def get_rounds_for_employee(self, employee_id):
        evaluations = PvpEvaluation.objects.filter(employee__id=employee_id)
        evaluations = evaluations.filter(evaluation_round__is_complete=True)
        evaluations = evaluations.extra(order_by=['evaluation_round__date'])
        ids = evaluations.values('evaluation_round__id')
        return self.filter(id__in=ids)

    def most_recent(self, is_complete=True):
        return self.filter(is_complete=is_complete).latest()


class EvaluationRound(models.Model):
    date = models.DateField()
    is_complete = models.BooleanField(default=False)
    objects = EvaluationRoundManager()

    def __str__(self):
        return "%s" % self.date

    class Meta:
        get_latest_by = 'date'


class PvpEvaluationManager(models.Manager):
    def get_evaluations_for_round(self, round_id):
        return self.filter(evaluation_round__id=round_id)

    def get_evaluations_for_employee(self, employee_id):
        evaluations = self.filter(employee__id=employee_id)
        return evaluations.filter(Q(is_complete=True) | Q(evaluation_round__is_complete=True))

    def get_evaluations_for_team(self, team_id, round_id):
        evaluations = self.filter(evaluation_round__id=round_id, employee__team__id=team_id)
        return evaluations.filter(Q(is_complete=True) | Q(evaluation_round__is_complete=True))

    def current_for_user(self, user):
        current_round = EvaluationRound.objects.most_recent()
        return self.filter(evaluation_round=current_round).filter(evaluator=user)

    def todos_for_user(self, user):
        current_round = EvaluationRound.objects.most_recent(is_complete=False)
        return self.filter(evaluation_round=current_round)

    def get_most_recent_for_all(self):
        evaluations = self.filter(employee__departure_date__isnull=True)
        evaluations = evaluations.exclude(employee__display=False)
        evaluations = evaluations.exclude(Q(is_complete=False) & Q(evaluation_round__is_complete=False))
        evaluations = evaluations.annotate(max_evaluation_date=Max('employee__pvp__evaluation_round__date'))
        evaluations = evaluations.filter(evaluation_round__date=F('max_evaluation_date'))
        return evaluations

    def get_most_recent_for_employees(self, employees):
        evaluations = self.exclude(employee__display=False)
        evaluations = evaluations.filter(employee__in=employees).filter(employee__departure_date__isnull=True)
        evaluations = evaluations.exclude(Q(is_complete=False) & Q(evaluation_round__is_complete=False))
        return evaluations


class PvpEvaluation(models.Model):
    NO_DATA = 0
    TOP_PERFORMER = 1
    STRONG_PERFORMER = 2
    GOOD_PERFORMER = 3
    LACKS_POTENTIAL = 4
    WRONG_ROLE = 5
    NEEDS_DRASTIC_CHANGE = 6
    TOO_NEW = 7
    SUMMARY_SCORE_SCALE = [NO_DATA, TOP_PERFORMER, STRONG_PERFORMER, GOOD_PERFORMER, LACKS_POTENTIAL, WRONG_ROLE, NEEDS_DRASTIC_CHANGE, TOO_NEW]

    objects = PvpEvaluationManager()
    employee = models.ForeignKey(Employee, related_name='pvp')
    evaluation_round = models.ForeignKey(EvaluationRound)
    potential = models.IntegerField(choices=PVP_SCALE, blank=True, default=0)
    performance = models.IntegerField(choices=PVP_SCALE, blank=True, default=0)
    comment = models.ForeignKey(Comment, null=True, blank=True)
    evaluator = models.ForeignKey(User, null=True, blank=True)
    too_new = models.BooleanField(default=False)
    is_complete = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.is_complete = self.performance > 0 and self.potential > 0
        super(PvpEvaluation, self).save(*args, **kwargs)
        return self

    def complete(self, potential, performance, evaluator=None):
        self.evaluator = evaluator
        self.potential = potential
        self.performance = performance

    def get_description(self):
        try:
            description = PvpDescription.objects.get(Q(potential=self.potential) & Q(performance=self.performance))
            return description
        except ObjectDoesNotExist:
            return None

    def talent_category(self):
        if self.too_new:
            return self.TOO_NEW
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
        return self.NO_DATA

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


class PvpDescription(models.Model):
    potential = models.IntegerField(choices=PVP_SCALE)
    performance = models.IntegerField(choices=PVP_SCALE)
    description = models.TextField(blank=True)

    def __str__(self):
        return "%s performance %s potential" % (self.performance, self.potential)