from .models import PvpEvaluation, EvaluationRound
from org.models import Employee

class TalentCategorySummary:
    def __init__(self, talent_category=0, count=0):
        self.talent_category = talent_category
        self.count = count

class TalentCategoryReport:
    def __init__(self, evaluation_date=None, total_evaluations=0, categories={}):
        self.evaluation_date = evaluation_date
        self.total_evaluations = total_evaluations
        self.categories = categories

def build_talent_category_report_for_employees(employees, evaluation_round):
    evaluations = PvpEvaluation.objects.filter(evaluation_round_id=evaluation_round.id).filter(employee__in=employees)
    total_evaluations = 0
    categories = {}
    for talent_category in PvpEvaluation.SUMMARY_SCORE_SCALE:
        matching_evaluations = [evaluation for evaluation in evaluations if evaluation.get_talent_category() == talent_category]
        categories[talent_category] = len(matching_evaluations)
        total_evaluations += categories[talent_category]
    return TalentCategoryReport(evaluation_date=evaluation_round.date, total_evaluations=total_evaluations, categories=categories)

def get_most_recent_talent_category_report_for_all_employees():
    current_round = EvaluationRound.objects.most_recent()
    employees = Employee.objects.all()
    return build_talent_category_report_for_employees(employees, current_round)

def get_most_recent_talent_category_report_for_team(team_id):
    current_round = EvaluationRound.objects.most_recent()
    employees = Employee.objects.filter(team_id=team_id)
    return build_talent_category_report_for_employees(employees, current_round)
