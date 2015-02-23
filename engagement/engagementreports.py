from .models import Happiness
from pvp.models import PvpEvaluation, EvaluationRound
from org.models import Employee
from datetime import date, timedelta

class TalentCategorySummary:
    def __init__(self, talent_category=0, count=0):
        self.talent_category = talent_category
        self.count = count

class TalentCategoryReport:
    def __init__(self, evaluation_date=None, total_evaluations=0, categories={}):
        self.evaluation_date = evaluation_date
        self.total_evaluations = total_evaluations
        self.categories = categories

def build_talent_category_report_for_employees(employees, neglected):
    evaluation_round = EvaluationRound.objects.most_recent()
    if neglected:
        evaluations = PvpEvaluation.objects.filter(evaluation_round_id=evaluation_round.id).exclude(employee__in=employees)
    else:
        evaluations = PvpEvaluation.objects.filter(evaluation_round_id=evaluation_round.id).filter(employee__in=employees)
    total_evaluations = 0
    categories = {}
    for talent_category in PvpEvaluation.SUMMARY_SCORE_SCALE:
        matching_evaluations = [evaluation for evaluation in evaluations if evaluation.talent_category() == talent_category]
        categories[talent_category] = len(matching_evaluations)
        total_evaluations += categories[talent_category]
    return TalentCategoryReport(evaluation_date=evaluation_round.date, total_evaluations=total_evaluations, categories=categories)

def get_employees_with_happiness_scores(days_ago, neglected):
    d = date.today()-timedelta(days=days_ago)
    happys = Happiness.objects.filter(assessed_date__gt=d)
    ids = []
    for happy in happys:
        ids.append(happy.employee.id)
    employees = Employee.objects.filter(id__in=ids)

    return build_talent_category_report_for_employees(employees, neglected)