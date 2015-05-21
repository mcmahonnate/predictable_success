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
    try:
        compensation_summaries = CompensationSummary.objects.get_most_recent().filter(employee__in=employees)
        categories = {}
        total_salaries = sum([item.salary for item in compensation_summaries])
        employee_salaries = dict([(summary.employee.id, summary.salary) for summary in compensation_summaries])
        for employee in employees:
            talent_category = employee.current_talent_category()
            salary = employee_salaries.get(employee.id, 0)
            if talent_category in categories:
                 categories[talent_category] += salary
            else:
                 categories[talent_category] = salary

        return SalaryReport(total_salaries=total_salaries, categories=categories)
    except EvaluationRound.DoesNotExist:
        return SalaryReport()


def get_salary_report_for_all_employees():
    employees = Employee.objects.get_current_employees()
    return build_salary_report(employees)


def get_salary_report_for_team(team_id):
    employees = Employee.objects.get_current_employees(team_id=team_id)
    return build_salary_report(employees)


def get_salary_report_for_lead(lead_id):
    employees = Employee.objects.get_current_employees_by_team_lead(lead_id=lead_id)
    return build_salary_report(employees)
