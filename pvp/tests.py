from django.test import TestCase
from org.models import Employee
from pvp.models import *
import datetime

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
