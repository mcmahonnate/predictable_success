import datetime
from django.test import TestCase
from org.models import Employee
from pvp.models import PvpEvaluation, EvaluationRound
from pvp.aggregation import PvpAggregation, PvpAggregatedScore, aggregate_all_most_recent

employee = Employee(informal_name='John Doe')
evaluation_round = EvaluationRound(date = datetime.date(2012, 12, 31))

class PvpEvaluationTest(TestCase):

    def create_pvp(self, potential=0, performance=0):
        pvp = PvpEvaluation(employee=employee, evaluation_round = evaluation_round)
        pvp.potential = potential
        pvp.performance = performance
        return pvp

    def test_get_summary_score(self):
        self.assert_summary_score(potential=4, performance=4, expected=PvpEvaluation.TOP_PERFORMER)
        self.assert_summary_score(potential=4, performance=3, expected=PvpEvaluation.STRONG_PERFORMER)
        self.assert_summary_score(potential=3, performance=4, expected=PvpEvaluation.STRONG_PERFORMER)
        self.assert_summary_score(potential=3, performance=3, expected=PvpEvaluation.GOOD_PERFORMER)
        self.assert_summary_score(potential=3, performance=2, expected=PvpEvaluation.WRONG_ROLE)
        self.assert_summary_score(potential=3, performance=1, expected=PvpEvaluation.WRONG_ROLE)
        self.assert_summary_score(potential=4, performance=2, expected=PvpEvaluation.WRONG_ROLE)
        self.assert_summary_score(potential=4, performance=1, expected=PvpEvaluation.WRONG_ROLE)
        self.assert_summary_score(potential=2, performance=3, expected=PvpEvaluation.LACKS_POTENTIAL)
        self.assert_summary_score(potential=1, performance=3, expected=PvpEvaluation.LACKS_POTENTIAL)
        self.assert_summary_score(potential=2, performance=4, expected=PvpEvaluation.LACKS_POTENTIAL)
        self.assert_summary_score(potential=1, performance=4, expected=PvpEvaluation.LACKS_POTENTIAL)
        self.assert_summary_score(potential=2, performance=2, expected=PvpEvaluation.NEEDS_DRASTIC_CHANGE)
        self.assert_summary_score(potential=2, performance=1, expected=PvpEvaluation.NEEDS_DRASTIC_CHANGE)
        self.assert_summary_score(potential=1, performance=2, expected=PvpEvaluation.NEEDS_DRASTIC_CHANGE)
        self.assert_summary_score(potential=1, performance=1, expected=PvpEvaluation.NEEDS_DRASTIC_CHANGE)

    def assert_summary_score(self, potential=0, performance=0, expected=0):
        pvp = self.create_pvp(potential=potential, performance=performance)
        actual = pvp.get_summary_score()
        self.assertEqual(actual, expected)

    def test_str(self):
        pvp = PvpEvaluation(employee=employee, evaluation_round = evaluation_round)
        expected = "John Doe PVP Evaluation 2012-12-31"
        actual = str(pvp)
        self.assertEqual(actual, expected)

class PvpEvaluationManagerTest(TestCase):
    def test_get_all_current_evaluations(self):
        r1 = EvaluationRound(date = datetime.date(2011, 12, 31))
        r1.save()
        r2 = EvaluationRound(date = datetime.date(2013, 12, 31))
        r2.save()
        e1 = Employee(informal_name='John Doe')
        e1.save()
        e2 = Employee(informal_name='Jane Doe')
        e2.save()
        PvpEvaluation(employee=e1, evaluation_round = r1, potential=4, performance=4).save()
        PvpEvaluation(employee=e1, evaluation_round = r2, potential=4, performance=4).save()
        PvpEvaluation(employee=e2, evaluation_round = r2, potential=4, performance=4).save()

        evaluations = PvpEvaluation.objects.get_all_current_evaluations()

        self.assertEqual(2, len(evaluations))

class EvaluationRoundTest(TestCase):
    def test_str(self):
        expected = "2012-12-31"
        actual = str(evaluation_round)
        self.assertEqual(actual, expected)

class EvaluationRoundManagerTest(TestCase):
    def test_most_recent(self):
        EvaluationRound(date = datetime.date(2012, 12, 31)).save()
        EvaluationRound(date = datetime.date(2013, 12, 31)).save()
        EvaluationRound(date = datetime.date(2011, 12, 31)).save()

        most_recent = EvaluationRound.objects.most_recent()

        self.assertEqual(most_recent.date, datetime.date(2013, 12, 31))

class PvpAggregationTest(TestCase):
    def test_init_counts_total_evaluations_correctly(self):
        agg = PvpAggregation(items=[PvpAggregatedScore(score=6, count=5), PvpAggregatedScore(score=4, count=4)])
        self.assertEqual(9, agg.total_evaluations)

class AggregateTest(TestCase):
    def test_aggregate_all_most_recent(self):
        evaluation_date = datetime.date(2011, 12, 31)
        r1 = EvaluationRound(date = evaluation_date)
        r1.save()
        e1 = Employee(informal_name='Employee 1')
        e1.save()
        e2 = Employee(informal_name='Employee 2')
        e2.save()
        e3 = Employee(informal_name='Employee 3')
        e3.save()
        e4 = Employee(informal_name='Employee 4')
        e4.save()
        e5 = Employee(informal_name='Employee 5')
        e5.save()
        e6 = Employee(informal_name='Employee 6')
        e6.save()

        PvpEvaluation(employee=e1, evaluation_round = r1, potential=4, performance=4).save()
        PvpEvaluation(employee=e2, evaluation_round = r1, potential=4, performance=3).save()
        PvpEvaluation(employee=e3, evaluation_round = r1, potential=3, performance=3).save()
        PvpEvaluation(employee=e4, evaluation_round = r1, potential=3, performance=2).save()
        PvpEvaluation(employee=e5, evaluation_round = r1, potential=2, performance=3).save()
        PvpEvaluation(employee=e6, evaluation_round = r1, potential=1, performance=1).save()

        agg = aggregate_all_most_recent()

        self.assertEqual(agg.evaluation_date, evaluation_date)
        self.assertEqual(agg.total_evaluations, 6)
        self.assertEqual(len(agg.items), 6)
        top_performers = [item for item in agg.items if item.score == PvpEvaluation.TOP_PERFORMER]
        self.assertEqual(1, len(top_performers))
        self.assertEqual(1, top_performers[0].count)
        strong_performers = [item for item in agg.items if item.score == PvpEvaluation.STRONG_PERFORMER]
        self.assertEqual(1, len(strong_performers))
        self.assertEqual(1, strong_performers[0].count)
        good_performers = [item for item in agg.items if item.score == PvpEvaluation.GOOD_PERFORMER]
        self.assertEqual(1, len(good_performers))
        self.assertEqual(1, good_performers[0].count)
        wrong_roles = [item for item in agg.items if item.score == PvpEvaluation.WRONG_ROLE]
        self.assertEqual(1, len(wrong_roles))
        self.assertEqual(1, wrong_roles[0].count)
        lacks_potential = [item for item in agg.items if item.score == PvpEvaluation.LACKS_POTENTIAL]
        self.assertEqual(1, len(lacks_potential))
        self.assertEqual(1, lacks_potential[0].count)
        needs_drastic_change = [item for item in agg.items if item.score == PvpEvaluation.NEEDS_DRASTIC_CHANGE]
        self.assertEqual(1, len(needs_drastic_change))
        self.assertEqual(1, needs_drastic_change[0].count)




# agg = PvpAggregator.aggregateAllMostRecent()
# agg.date
# agg.total_items
# agg.items[0].score
# agg.items[0].count
