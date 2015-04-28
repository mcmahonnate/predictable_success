from django.test import TestCase
from org.models import Employee
from org.models import Team
from org.models import Mentorship
from org.models import Leadership


class EmployeeTests(TestCase):
    def test_str_should_equal_full_name(self):
        full_name = 'John Doe'
        employee = Employee(full_name=full_name)
        self.assertEquals(str(employee), full_name)


class TeamTests(TestCase):
    def test_str_should_equal_name(self):
        name = 'Sales Team'
        team = Team(name=name)
        self.assertEquals(str(team), name)


class MentorshipTests(TestCase):
    def test_str(self):
        expected = 'John Doe mentor of Joe Schmoe'
        john = Employee(full_name='John Doe')
        joe = Employee(full_name='Joe Schmoe')
        mentorship = Mentorship(mentor=john, mentee=joe)
        self.assertEquals(str(mentorship), expected)


class LeadershipTests(TestCase):
    def test_str(self):
        expected = 'John Doe leader of Joe Schmoe'
        john = Employee(full_name='John Doe')
        joe = Employee(full_name='Joe Schmoe')
        leadership = Leadership(leader=john, employee=joe)
        self.assertEquals(str(leadership), expected)        
