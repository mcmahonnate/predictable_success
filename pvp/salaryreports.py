import logging
from decimal import Decimal
from comp.models import CompensationSummary
from pvp.models import EvaluationRound, PvpEvaluation
from org.models import Employee

class SalaryReport():
    def __init__(self, total_salaries=Decimal('0.00'), categories={}):
        self.total_salaries = total_salaries
        self.categories = categories

def build_salary_report(employees):
    evaluation_round = EvaluationRound.objects.most_recent()
    compensation_summaries = CompensationSummary.objects.get_most_recent().filter(employee__in=employees)
    pvp_evaluations = PvpEvaluation.objects.get_evaluations_for_round(evaluation_round.id).filter(employee__in=employees)
    categories = {}
    total_salaries = sum([item.salary for item in compensation_summaries])
    employee_salaries = dict([(summary.employee.id, summary.salary) for summary in compensation_summaries])
    for evaluation in pvp_evaluations:
        talent_category = evaluation.get_talent_category()
        salary = employee_salaries.get(evaluation.employee.id, 0)
        if talent_category in categories:
             categories[talent_category] += salary
        else:
             categories[talent_category] = salary

    return SalaryReport(total_salaries=total_salaries, categories=categories)

def get_salary_report_for_all_employees():
    employees = Employee.objects.all()
    return build_salary_report(employees)

def get_salary_report_for_team(team_id):
    employees = Employee.objects.filter(team_id = team_id)
    return build_salary_report(employees)
