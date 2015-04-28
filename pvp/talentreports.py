from .models import PvpEvaluation, EvaluationRound
from org.models import Employee
from django.utils.log import getLogger

logger = getLogger('talentdashboard')


class TalentCategorySummary:
    def __init__(self, talent_category=0, count=0):
        self.talent_category = talent_category
        self.count = count


class TalentCategoryReport:
    def __init__(self, evaluation_date=None, total_evaluations=0, categories={}):
        self.evaluation_date = evaluation_date
        self.total_evaluations = total_evaluations
        self.categories = categories


def build_talent_category_report_for_employees(employees):
    try:
        evaluation_round = EvaluationRound.objects.most_recent()
        evaluations = PvpEvaluation.objects.filter(evaluation_round_id=evaluation_round.id).filter(employee__in=employees).filter(employee__departure_date__isnull=True)
        total_evaluations = 0
        categories = {}
        for talent_category in PvpEvaluation.SUMMARY_SCORE_SCALE:
            matching_evaluations = [evaluation for evaluation in evaluations if evaluation.talent_category() == talent_category]
            categories[talent_category] = len(matching_evaluations)
            total_evaluations += categories[talent_category]
        return TalentCategoryReport(evaluation_date=evaluation_round.date, total_evaluations=total_evaluations, categories=categories)
    except EvaluationRound.DoesNotExist:
        return TalentCategoryReport()


def get_talent_category_report_for_all_employees():
    employees = Employee.objects.all()
    return build_talent_category_report_for_employees(employees)


def get_talent_category_report_for_team(team_id):
    employees = Employee.objects.filter(team_id=team_id)
    return build_talent_category_report_for_employees(employees)


def get_talent_category_report_for_lead(lead_id):
    employees = Employee.objects.filter(leaderships__leader__id=lead_id)
    return build_talent_category_report_for_employees(employees)
