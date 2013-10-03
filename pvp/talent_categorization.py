from .models import PvpEvaluation

class TalentCategorySummary:
    talent_category = None
    count = 0

    def __init__(self, talent_category=0, count=0):
        self.talent_category = talent_category
        self.count = count

class TalentCategoryReport:
    evaluation_date = None
    total_evaluations = 0
    items = []

    def __init__(self, evaluation_date=None, items=[]):
        self.evaluation_date = evaluation_date
        self.items = items
        self.total_evaluations = sum([item.count for item in items])

def get_most_recent_talent_category_report_for_all_employees():
    evaluations = PvpEvaluation.objects.get_all_current_evaluations()
    aggregated_talent_categories = []
    evaluation_date = evaluations[0].evaluation_round.date
    for talent_category in PvpEvaluation.SUMMARY_SCORE_SCALE:
        matching_evaluations = [evaluation for evaluation in evaluations if evaluation.get_talent_category() == talent_category]
        aggregated_talent_categories.append(TalentCategorySummary(talent_category=talent_category, count=len(matching_evaluations)))

    return TalentCategoryReport(evaluation_date=evaluation_date, items=aggregated_talent_categories)
