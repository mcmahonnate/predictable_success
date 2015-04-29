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

    def test_get_most_recent_for_all_employees(self):
        old_round = EvaluationRound(date=datetime.date(2012, 12, 31))
        new_round = EvaluationRound(date=datetime.date(2013, 12, 31))
        old_round.save()
        new_round.save()
        john = Employee(full_name='John Doe')
        jane = Employee(full_name='Jane Doe')
        john.save()
        jane.save()
        pvp1 = PvpEvaluation(employee=john, evaluation_round=old_round, potential=1, performance=1).save()
        pvp2 = PvpEvaluation(employee=john, evaluation_round=new_round, potential=1, performance=1).save()
        pvp3 = PvpEvaluation(employee=jane, evaluation_round=old_round, potential=1, performance=1).save()

        pvps = PvpEvaluation.objects.get_most_recent_for_employees([john, jane])

        self.assertFalse(pvp1 in pvps)
        self.assertTrue(pvp2 in pvps)
        self.assertTrue(pvp3 in pvps)



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
        e1 = Employee(full_name='Employee 1')
        e1.save()
        e2 = Employee(full_name='Employee 2')
        e2.save()
        e3 = Employee(full_name='Employee 3')
        e3.save()
        e4 = Employee(full_name='Employee 4')
        e4.save()
        e5 = Employee(full_name='Employee 5')
        e5.save()
        e6 = Employee(full_name='Employee 6')
        e6.save()

        PvpEvaluation(employee=e1, evaluation_round=r1, potential=4, performance=4).save()
        PvpEvaluation(employee=e2, evaluation_round=r1, potential=4, performance=3).save()
        PvpEvaluation(employee=e3, evaluation_round=r1, potential=3, performance=3).save()
        PvpEvaluation(employee=e4, evaluation_round=r1, potential=3, performance=2).save()
        PvpEvaluation(employee=e5, evaluation_round=r1, potential=2, performance=3).save()
        PvpEvaluation(employee=e6, evaluation_round=r1, potential=1, performance=1).save()

        report = get_talent_category_report_for_all_employees()

        expected_categories = {1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1}
        self.assertEqual(report.evaluation_date, evaluation_date)
        self.assertEqual(report.total_evaluations, 6)
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
