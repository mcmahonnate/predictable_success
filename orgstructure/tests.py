from django.test import TestCase
from orgstructure.models import Employee
from orgstructure.models import Customer

class EmployeeTests(TestCase):
    def test_str_should_equal_informal_name(self):
        informal_name = 'John Doe'
        employee = Employee(informal_name=informal_name)
        self.assertEquals(str(employee), informal_name)


class CustomerTests(TestCase):
    def test_str_should_equal_name(self):
        name = 'John Doe'
        customer = Customer(name=name)
        self.assertEquals(str(customer), name)
