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

class EvaluationRoundTest(TestCase):
    def test_str(self):
        expected = "2012-12-31"
        actual = str(evaluation_round)
        self.assertEqual(actual, expected)
