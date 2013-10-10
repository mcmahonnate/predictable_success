from django.test import TestCase
from org.models import Employee
from comp.models import CompensationSummary

class CompensationSummaryTest(TestCase):
    def test_str(self):
        expected = 'John Doe compensation FY2012'
        john = Employee(informal_name='John Doe')
        compensation_summary = CompensationSummary(employee=john, fiscal_year=2012)
        self.assertEquals(str(compensation_summary), expected)

    def test_total(self):
        expected = 100000
        compensation_summary = CompensationSummary(salary=25000.00, bonus=25000.00, discretionary=25000.00, writer_payments_and_royalties=25000.00)
        actual = compensation_summary.get_total_compensation()
        self.assertEquals(actual, expected)
