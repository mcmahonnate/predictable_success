from pvp.models import EvaluationRound, PvpEvaluation

class PvpAggregatedScore:
    score = None
    count = 0

    def __init__(self, score=0, count=0):
        self.score = score
        self.count = count

class PvpAggregation:
    evaluation_date = None
    total_evaluations = 0
    items = []

    def __init__(self, evaluation_date=None, items=[]):
        self.evaluation_date = evaluation_date
        self.items = items
        self.total_evaluations = sum([item.count for item in items])

def aggregate_all_most_recent():
    evaluations = PvpEvaluation.objects.get_all_current_evaluations()
    aggregated_scores = []
    evaluation_date = evaluations[0].evaluation_round.date
    for score in PvpEvaluation.SUMMARY_SCORE_SCALE:
        matching_evaluations = [evaluation for evaluation in evaluations if evaluation.get_summary_score() == score]
        aggregated_scores.append(PvpAggregatedScore(score=score, count=len(matching_evaluations)))

    return PvpAggregation(evaluation_date=evaluation_date, items=aggregated_scores)
