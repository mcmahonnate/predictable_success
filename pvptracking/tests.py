from django.test import TestCase
from orgstructure.models import Employee
from pvptracking.models import PvpEvaluation
import datetime

class PvpEvaluationTest(TestCase):
    def test_str(self):
        employee = Employee(informal_name='John Doe')
        pvp = PvpEvaluation(employee=employee, date = datetime.date(2012, 12, 31))
        expected = "John Doe PVP Evaluation 2012-12-31"
        actual = str(pvp)
        self.assertEqual(actual, expected)
