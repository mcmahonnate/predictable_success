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

    def test_is_top_performer(self):
        pvp = self.create_pvp(potential=4, performance=4)
        result = pvp.is_top_performer()
        self.assertTrue(result)
        result = pvp.is_strong_performer() \
            and pvp.is_good_performer() \
            and pvp.is_in_wrong_role \
            and pvp.lacks_potential() \
            and pvp.needs_drastic_change
        self.assertFalse(result)

    def test_is_strong_performer(self):
        self.assert_is_strong_performer(potential=4, performance=3)
        self.assert_is_strong_performer(potential=3, performance=4)

    def assert_is_strong_performer(self, potential, performance):
        pvp = self.create_pvp(potential=potential, performance=performance)
        result = pvp.is_strong_performer()
        self.assertTrue(result)
        result = pvp.is_top_performer() \
            and pvp.is_good_performer() \
            and pvp.is_in_wrong_role \
            and pvp.lacks_potential() \
            and pvp.needs_drastic_change
        self.assertFalse(result)

    def test_is_good_performer(self):
        pvp = self.create_pvp(potential=3, performance=3)
        result = pvp.is_good_performer()
        self.assertTrue(result)
        result = pvp.is_top_performer() \
            and pvp.is_strong_performer() \
            and pvp.is_in_wrong_role \
            and pvp.lacks_potential() \
            and pvp.needs_drastic_change
        self.assertFalse(result)

    def test_is_in_wrong_role(self):
        self.assert_is_in_wrong_role(potential=3, performance=2)
        self.assert_is_in_wrong_role(potential=3, performance=1)
        self.assert_is_in_wrong_role(potential=4, performance=2)
        self.assert_is_in_wrong_role(potential=4, performance=1)

    def assert_is_in_wrong_role(self, potential, performance):
        pvp = self.create_pvp(potential=potential, performance=performance)
        result = pvp.is_in_wrong_role()
        self.assertTrue(result)
        result = pvp.is_top_performer() \
            and pvp.is_strong_performer() \
            and pvp.is_good_performer \
            and pvp.lacks_potential() \
            and pvp.needs_drastic_change
        self.assertFalse(result)

    def test_lacks_potential(self):
        self.assert_lacks_potential_is_true(potential=2, performance=3)
        self.assert_lacks_potential_is_true(potential=1, performance=3)
        self.assert_lacks_potential_is_true(potential=2, performance=4)
        self.assert_lacks_potential_is_true(potential=1, performance=4)

    def assert_lacks_potential_is_true(self, potential, performance):
        pvp = self.create_pvp(potential=potential, performance=performance)
        result = pvp.lacks_potential()
        self.assertTrue(result)
        result = pvp.is_top_performer() \
            and pvp.is_strong_performer() \
            and pvp.is_good_performer \
            and pvp.is_in_wrong_role() \
            and pvp.needs_drastic_change
        self.assertFalse(result)

    def test_needs_drastic_change(self):
        self.assert_needs_drastic_change(potential=2, performance=2)
        self.assert_needs_drastic_change(potential=2, performance=1)
        self.assert_needs_drastic_change(potential=1, performance=2)
        self.assert_needs_drastic_change(potential=1, performance=1)

    def assert_needs_drastic_change(self, potential, performance):
        pvp = self.create_pvp(potential=potential, performance=performance)
        result = pvp.needs_drastic_change()
        self.assertTrue(result)
        result = pvp.is_top_performer() \
            and pvp.is_strong_performer() \
            and pvp.is_good_performer \
            and pvp.is_in_wrong_role() \
            and pvp.lacks_potential()
        self.assertFalse(result)

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
