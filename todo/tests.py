from django.test import TestCase
from todo.models import Task

class TaskTests(TestCase):
    def test_str_should_equal_description(self):
        description = 'This is a Task'
        task = Task(description=description)
        self.assertEquals(str(task), description)