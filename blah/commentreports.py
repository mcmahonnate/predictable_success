from .models import Comment
from org.models import Employee
from django.contrib.contenttypes.models import ContentType
from datetime import date, timedelta

class TalentCategorySummary:
    def __init__(self, talent_category=0, count=0):
        self.talent_category = talent_category
        self.count = count

class TalentCategoryReport:
    def __init__(self, evaluation_date=None, total_evaluations=0, categories=None):
        if categories is None:
            categories = {}
        self.evaluation_date = evaluation_date
        self.total_evaluations = total_evaluations
        self.categories = categories

def get_employees_with_comments(days_ago, neglected):
    employee_type = ContentType.objects.get(model="employee")

    d = date.today()-timedelta(days=days_ago)
    comments = Comment.objects.filter(created_date__gt=d, content_type=employee_type)
    ids = []
    for comment in comments:
        ids.append(comment.object_id)
    employees = Employee.objects.filter(id__in=ids)

    return build_talent_category_report_for_employees(employees, neglected)