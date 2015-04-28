from django.test import TestCase
from todo.models import Task
from org.models import Employee


class TaskTests(TestCase):
    def test_str_should_equal_description(self):
        employee = Employee(full_name="John Doe")
        description = 'This is a Task'
        task = Task(description=description, created_by=employee)
        self.assertEquals(str(task), "John Doe created task {0}".format(description))