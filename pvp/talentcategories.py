from .models import PvpEvaluation, EvaluationRound

class TalentCategorySummary:
    def __init__(self, talent_category=0, count=0):
        self.talent_category = talent_category
        self.count = count

class TalentCategoryReport:

    def __init__(self, evaluation_round=None, evaluations=[]):
        self.evaluation_date = evaluation_round.date
        self.total_evaluations = 0
        self.categories = {}
        for talent_category in PvpEvaluation.SUMMARY_SCORE_SCALE:
            matching_evaluations = [evaluation for evaluation in evaluations if evaluation.get_talent_category() == talent_category]
            self.categories[talent_category] = len(matching_evaluations)
            self.total_evaluations += self.categories[talent_category]

class PvpEvaluationsByTalentCategoryReport:
    talent_category_id = None
    evaluations = []

    def __init__(self, talent_category_id=None, evaluations=[]):
        self.talent_category_id = talent_category_id
        self.evaluations = evaluations

def get_most_recent_talent_category_report_for_all_employees():
    current_round = EvaluationRound.objects.most_recent()
    evaluations = PvpEvaluation.objects.get_evaluations_for_round(current_round.id)
    return TalentCategoryReport(evaluation_round=current_round, evaluations=evaluations)

def get_most_recent_talent_category_report_for_team(team_id):
    current_round = EvaluationRound.objects.most_recent()
    evaluations = PvpEvaluation.objects.get_evaluations_for_team(team_id, current_round.id)
    return TalentCategoryReport(evaluation_round=current_round, evaluations=evaluations)
