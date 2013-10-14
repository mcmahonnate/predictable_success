from decimal import Decimal
from comp.models import CompensationSummary
from pvp.models import EvaluationRound, PvpEvaluation

class SalaryReport():
    total_salaries = Decimal('0.00')
    categories = {}

    def __init__(self, compensation_summaries=[], pvp_evaluations=[]):
        self.total_salaries = sum([item.salary for item in compensation_summaries])
        employee_salaries = dict([(summary.employee.id, summary.salary) for summary in compensation_summaries])
        for evaluation in pvp_evaluations:
            talent_category = evaluation.get_talent_category()
            if talent_category in self.categories:
                 self.categories[talent_category] = self.categories[talent_category] + employee_salaries[evaluation.employee.id]
            else:
                 self.categories[talent_category] = employee_salaries[evaluation.employee.id]

def get_salary_report_for_all_employees():
    compensation_summaries = CompensationSummary.objects.get_most_recent()
    evaluation_round = EvaluationRound.objects.most_recent()
    pvp_evaluations = PvpEvaluation.objects.get_evaluations_for_round(evaluation_round.id)
    return SalaryReport(compensation_summaries=compensation_summaries, pvp_evaluations=pvp_evaluations)