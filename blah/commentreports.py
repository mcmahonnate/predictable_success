from .models import Comment
from pvp.models import PvpEvaluation, EvaluationRound
from org.models import Employee
from django.contrib.contenttypes.models import ContentType
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

def build_talent_category_report_for_employees(employees):
    evaluation_round = EvaluationRound.objects.most_recent()
    evaluations = PvpEvaluation.objects.filter(evaluation_round_id=evaluation_round.id).filter(employee__in=employees)
    total_evaluations = 0
    categories = {}
    for talent_category in PvpEvaluation.SUMMARY_SCORE_SCALE:
        matching_evaluations = [evaluation for evaluation in evaluations if evaluation.get_talent_category() == talent_category]
        categories[talent_category] = len(matching_evaluations)
        total_evaluations += categories[talent_category]
    return TalentCategoryReport(evaluation_date=evaluation_round.date, total_evaluations=total_evaluations, categories=categories)

def get_employees_with_no_comments():
    employee_type = ContentType.objects.get(model="employee")
    days_to_subtract = 30

    d = date.today()-timedelta(days=days_to_subtract)
    comments = Comment.objects.filter(created_date__gt=d, content_type=employee_type)
    ids = []
    for comment in comments:
        ids.append(comment.object_id)
    employees = Employee.objects.filter(id__in=ids)

    return build_talent_category_report_for_employees(employees)