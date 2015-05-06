import datetime
from tenant_schemas.test.cases import TenantTestCase as TestCase
from org.models import Employee
from pvp.models import PvpEvaluation, EvaluationRound
from comp.models import CompensationSummary
from .talentreports import get_talent_category_report_for_all_employees
from .salaryreports import get_salary_report_for_all_employees


class PvpEvaluationTest(TestCase):

    def create_pvp(self, potential=0, performance=0):
        employee = Employee(full_name='John Doe')
        evaluation_round = EvaluationRound(date = datetime.date(2012, 12, 31))
        pvp = PvpEvaluation(employee=employee, evaluation_round = evaluation_round)
        pvp.potential = potential
        pvp.performance = performance
        return pvp

    def test_get_most_recent(self):
        round_1 = EvaluationRound(date=datetime.date(2012, 12, 31), is_complete=True)
        round_2 = EvaluationRound(date=datetime.date(2013, 12, 31), is_complete=True)
        round_3 = EvaluationRound(date=datetime.date(2014, 12, 31), is_complete=False)
        round_1.save()
        round_2.save()
        round_3.save()
        john = Employee(full_name='John Doe', display=True)
        jane = Employee(full_name='Jane Doe', display=True)
        john.save()
        jane.save()
        pvp1 = PvpEvaluation(employee=john, evaluation_round=round_1, potential=1, performance=1, is_complete=True).save()
        pvp2 = PvpEvaluation(employee=john, evaluation_round=round_2, potential=1, performance=1, is_complete=True).save()
        pvp3 = PvpEvaluation(employee=jane, evaluation_round=round_1, potential=1, performance=1, is_complete=True).save()
        pvp4 = PvpEvaluation(employee=john, evaluation_round=round_3, is_complete=False).save()
        john_current_pvp = john.current_pvp
        jane_current_pvp = jane.current_pvp
        self.assertNotEqual(pvp1.id, john_current_pvp.id)
        self.assertEqual(pvp2.id, john_current_pvp.id)
        self.assertEqual(pvp3.id, jane_current_pvp.id)
        self.assertNotEqual(pvp4.id, john_current_pvp.id)

    def test_get_all_employees(self):
        round_1 = EvaluationRound(date=datetime.date(2012, 12, 31))
        round_2 = EvaluationRound(date=datetime.date(2013, 12, 31))
        round_3 = EvaluationRound(date=datetime.date(2014, 12, 31))
        round_1.save()
        round_2.save()
        round_3.save()
        john = Employee(full_name='John Doe', display=True)
        john.save()
        pvp1 = PvpEvaluation(employee=john, evaluation_round=round_1, potential=1, performance=1).save()
        pvp2 = PvpEvaluation(employee=john, evaluation_round=round_2, potential=1, performance=1).save()
        pvp3 = PvpEvaluation(employee=john, evaluation_round=round_3).save()
        pvps = PvpEvaluation.objects.get_evaluations_for_employee(john.id)
        self.assertTrue(pvp1 in pvps)
        self.assertTrue(pvp2 in pvps)
        self.assertFalse(pvp3 in pvps)

    def test_get_talent_category(self):
        self.assert_talent_category(potential=4, performance=4, expected=PvpEvaluation.TOP_PERFORMER)
        self.assert_talent_category(potential=4, performance=3, expected=PvpEvaluation.STRONG_PERFORMER)
        self.assert_talent_category(potential=3, performance=4, expected=PvpEvaluation.STRONG_PERFORMER)
        self.assert_talent_category(potential=3, performance=3, expected=PvpEvaluation.GOOD_PERFORMER)
        self.assert_talent_category(potential=3, performance=2, expected=PvpEvaluation.WRONG_ROLE)
        self.assert_talent_category(potential=3, performance=1, expected=PvpEvaluation.WRONG_ROLE)
        self.assert_talent_category(potential=4, performance=2, expected=PvpEvaluation.WRONG_ROLE)
        self.assert_talent_category(potential=4, performance=1, expected=PvpEvaluation.WRONG_ROLE)
        self.assert_talent_category(potential=2, performance=3, expected=PvpEvaluation.LACKS_POTENTIAL)
        self.assert_talent_category(potential=1, performance=3, expected=PvpEvaluation.LACKS_POTENTIAL)
        self.assert_talent_category(potential=2, performance=4, expected=PvpEvaluation.LACKS_POTENTIAL)
        self.assert_talent_category(potential=1, performance=4, expected=PvpEvaluation.LACKS_POTENTIAL)
        self.assert_talent_category(potential=2, performance=2, expected=PvpEvaluation.NEEDS_DRASTIC_CHANGE)
        self.assert_talent_category(potential=2, performance=1, expected=PvpEvaluation.NEEDS_DRASTIC_CHANGE)
        self.assert_talent_category(potential=1, performance=2, expected=PvpEvaluation.NEEDS_DRASTIC_CHANGE)
        self.assert_talent_category(potential=1, performance=1, expected=PvpEvaluation.NEEDS_DRASTIC_CHANGE)

    def assert_talent_category(self, potential=0, performance=0, expected=0):
        pvp = self.create_pvp(potential=potential, performance=performance)
        actual = pvp.talent_category()
        self.assertEqual(actual, expected)

    def test_str(self):
        employee = Employee(full_name='John Doe')
        evaluation_round = EvaluationRound(date=datetime.date(2012, 12, 31))
        pvp = PvpEvaluation(employee=employee, evaluation_round=evaluation_round)
        expected = "John Doe PVP Evaluation 2012-12-31"
        actual = str(pvp)
        self.assertEqual(actual, expected)


class PvpEvaluationManagerTest(TestCase):
    def setUp(self):
        PvpEvaluation.objects.all().delete()
        EvaluationRound.objects.all().delete()
        Employee.objects.all().delete()

    def test_get_evaluations_for_round(self):
        r1 = EvaluationRound(date = datetime.date(2011, 12, 31))
        r1.save()
        r2 = EvaluationRound(date = datetime.date(2013, 12, 31))
        r2.save()
        e1 = Employee(full_name='John Doe')
        e1.save()
        e2 = Employee(full_name='Jane Doe')
        e2.save()
        PvpEvaluation(employee=e1, evaluation_round = r1, potential=4, performance=4).save()
        PvpEvaluation(employee=e1, evaluation_round = r2, potential=4, performance=4).save()
        PvpEvaluation(employee=e2, evaluation_round = r2, potential=4, performance=4).save()

        evaluations = PvpEvaluation.objects.get_evaluations_for_round(r2.id)

        self.assertEqual(2, len(evaluations))


class EvaluationRoundTest(TestCase):
    def test_str(self):
        evaluation_round = EvaluationRound(date = datetime.date(2012, 12, 31))
        expected = "2012-12-31"
        actual = str(evaluation_round)
        self.assertEqual(actual, expected)


class EvaluationRoundManagerTest(TestCase):
    def setUp(self):
        EvaluationRound.objects.all().delete()

    def test_most_recent(self):
        EvaluationRound(date=datetime.date(2012, 12, 31), is_complete=True).save()
        EvaluationRound(date=datetime.date(2013, 12, 31), is_complete=True).save()
        EvaluationRound(date=datetime.date(2011, 12, 31), is_complete=True).save()

        most_recent = EvaluationRound.objects.most_recent()

        self.assertEqual(most_recent.date, datetime.date(2013, 12, 31))


class TalentCategoryReportTest(TestCase):
    def setUp(self):
        PvpEvaluation.objects.all().delete()
        EvaluationRound.objects.all().delete()
        Employee.objects.all().delete()

    def test_get_talent_category_report_for_all_employees(self):
        evaluation_date = datetime.date(2011, 12, 31)
        r1 = EvaluationRound(date=evaluation_date, is_complete=True)
        r1.save()
        e1 = Employee(full_name='Employee 1', display=True)
        e1.save()
        e2 = Employee(full_name='Employee 2', display=True)
        e2.save()
        e3 = Employee(full_name='Employee 3', display=True)
        e3.save()
        e4 = Employee(full_name='Employee 4', display=True)
        e4.save()
        e5 = Employee(full_name='Employee 5', display=True)
        e5.save()
        e6 = Employee(full_name='Employee 6', display=True)
        e6.save()
        e7 = Employee(full_name='Employee 7', display=True)
        e7.save()

        PvpEvaluation(employee=e1, evaluation_round=r1, potential=4, performance=4).save()
        PvpEvaluation(employee=e2, evaluation_round=r1, potential=4, performance=3).save()
        PvpEvaluation(employee=e3, evaluation_round=r1, potential=3, performance=3).save()
        PvpEvaluation(employee=e4, evaluation_round=r1, potential=3, performance=2).save()
        PvpEvaluation(employee=e5, evaluation_round=r1, potential=2, performance=3).save()
        PvpEvaluation(employee=e6, evaluation_round=r1, potential=1, performance=1).save()
        PvpEvaluation(employee=e7, evaluation_round=r1, too_new=True).save()

        report = get_talent_category_report_for_all_employees()

        expected_categories = {0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1}
        self.assertEqual(report.evaluation_date, evaluation_date)
        self.assertEqual(report.total_evaluations, 7)
        self.assertEqual(report.categories, expected_categories)


class SalaryReportTest(TestCase):
    def test_get_salary_report_for_all_employees(self):
        evaluation_date = datetime.date(2011, 12, 31)
        r1 = EvaluationRound(date=evaluation_date, is_complete=True)
        r1.save()

        e1 = Employee(full_name='Employee 1')
        e1.save()

        e2 = Employee(full_name='Employee 2')
        e2.save()

        PvpEvaluation(employee=e1, evaluation_round = r1, potential=4, performance=4).save()
        PvpEvaluation(employee=e2, evaluation_round = r1, potential=4, performance=3).save()
        CompensationSummary(employee=e1, salary='55000.00', year=2013).save()
        CompensationSummary(employee=e2, salary='45000.00', year=2013).save()

        report = get_salary_report_for_all_employees()
        expected_categories = {1: 55000, 2: 45000}

        self.assertEqual(100000, report.total_salaries)
        self.assertEqual(expected_categories, report.categories)
