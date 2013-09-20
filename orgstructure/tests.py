from django.test import TestCase
from orgstructure.models import Employee
from orgstructure.models import Organization
from orgstructure.models import Team
from orgstructure.models import Mentorship

class EmployeeTests(TestCase):
    def test_str_should_equal_informal_name(self):
        informal_name = 'John Doe'
        employee = Employee(informal_name=informal_name)
        self.assertEquals(str(employee), informal_name)


class OrganizationTests(TestCase):
    def test_str_should_equal_name(self):
        name = 'John Doe'
        organization = Organization(name=name)
        self.assertEquals(str(organization), name)


class TeamTests(TestCase):
    def test_str_should_equal_name(self):
        name = 'Sales Team'
        team = Team(name=name)
        self.assertEquals(str(team), name)


class MentorshipTests(TestCase):
    def test_str(self):
        expected = 'John Doe mentorship of Joe Schmoe'
        john = Employee(informal_name='John Doe')
        joe = Employee(informal_name='Joe Schmoe')
        mentorship = Mentorship(mentor=john, mentee=joe)
        self.assertEquals(str(mentorship), expected)
