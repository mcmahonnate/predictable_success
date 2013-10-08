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
    categories = []

    def __init__(self, evaluation_date=None, categories=[]):
        self.evaluation_date = evaluation_date
        self.categories = categories
        self.total_evaluations = sum([item.count for item in categories])

class PvpEvaluationsByTalentCategoryReport:
    talent_category_id = None
    evaluations = []

    def __init__(self, talent_category_id=None, evaluations=[]):
        self.talent_category_id = talent_category_id
        self.evaluations = evaluations

def build_talent_report(evaluations):
    aggregated_talent_categories = []
    if len(evaluations) > 0:
        evaluation_date = evaluations[0].evaluation_round.date
        for talent_category in PvpEvaluation.SUMMARY_SCORE_SCALE:
            matching_evaluations = [evaluation for evaluation in evaluations if evaluation.get_talent_category() == talent_category]
            aggregated_talent_categories.append(TalentCategorySummary(talent_category=talent_category, count=len(matching_evaluations)))

        return TalentCategoryReport(evaluation_date=evaluation_date, categories=aggregated_talent_categories)
    raise Exception("No evaluations found")

def get_most_recent_talent_category_report_for_all_employees():
    evaluations = PvpEvaluation.objects.get_all_current_evaluations()
    return build_talent_report(evaluations)

def get_most_recent_talent_category_report_for_team(team_id):
    evaluations = PvpEvaluation.objects.get_all_current_evaluations_for_team(team_id)
    return build_talent_report(evaluations)

def get_current_evaluations_with_talent_category(talent_category_id):
    evaluations = PvpEvaluation.objects.get_all_current_evaluations()
    filtered_evaluations = [evaluation for evaluation in evaluations if evaluation.get_talent_category() == talent_category_id]
    return PvpEvaluationsByTalentCategoryReport(talent_category_id=talent_category_id, evaluations=filtered_evaluations)


