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
        total_evaluations = 0
        categories = {}
        for talent_category in PvpEvaluation.SUMMARY_SCORE_SCALE:
            matching_evaluations = 0
            for employee in employees:
                current_talent_category = employee.current_talent_category()
                if current_talent_category == talent_category:
                    matching_evaluations += 1
            categories[talent_category] = matching_evaluations
            total_evaluations += categories[talent_category]
        return TalentCategoryReport(evaluation_date=evaluation_round.date, total_evaluations=total_evaluations, categories=categories)
    except EvaluationRound.DoesNotExist:
        return TalentCategoryReport()


def get_talent_category_report_for_all_employees():
    employees = Employee.objects.get_current_employees()
    return build_talent_category_report_for_employees(employees)


def get_talent_category_report_for_team(team_id):
    employees = Employee.objects.get_current_employees(team_id=team_id)
    return build_talent_category_report_for_employees(employees)


def get_talent_category_report_for_lead(lead_id):
    employees = Employee.objects.get_current_employees_by_team_lead(lead_id=lead_id)
    return build_talent_category_report_for_employees(employees)

def get_talent_category_report_for_coach(coach_id):
    employees = Employee.objects.get_current_employees_by_coach(coach_id=coach_id)
    return build_talent_category_report_for_employees(employees)