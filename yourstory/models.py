from django.db import models
from model_utils.models import TimeStampedModel
from org.models import Employee


class TextResponse(TimeStampedModel):
    """
    A text response to a Your Story question.
    """
    question = models.TextField(blank=False)
    text = models.TextField(blank=True)
    is_public = models.BooleanField(default=False)


class EmployeeChoiceResponse(TimeStampedModel):
    """
    A response to a Your Story question that consists of choosing
    one or more Employees, e.g. "Who are your favorite Fools?"
    """
    question = models.TextField(blank=False)
    employees = models.ManyToManyField(Employee)
    is_public = models.BooleanField(default=False)


class YourStory(TimeStampedModel):
    """
    Container for all of the Your Story responses that have been collected for a
    specific Employee.
    """
    employee = models.ForeignKey(Employee, unique=True)
    a1 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a2 = models.ForeignKey(EmployeeChoiceResponse, null=True, related_name='+')
    a3 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a4 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a5 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a6 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a7 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a8 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a9 = models.ForeignKey(EmployeeChoiceResponse, null=True, related_name='+')
    a10 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a11 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a12 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a13 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a14 = models.ForeignKey(EmployeeChoiceResponse, null=True, related_name='+')
    a15 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a16 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a17 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a18 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a19 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a20 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a21 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a22 = models.ForeignKey(EmployeeChoiceResponse, null=True, related_name='+')

    @staticmethod
    def _get_field_name_for_question(question_number):
        return 'a{}'.format(question_number)

    def next_unanswered_question_number(self):
        """
        Finds the number of the next unanswered question
        :return: The next unanswered question number, or None if all questions have been answered
        """
        question_number = 1
        while True:
            key = self._get_field_name_for_question(question_number)
            if not hasattr(self, key):
                return None
            value = getattr(self, key)
            if value is None:
                return question_number
            question_number += 1

    def add_answer(self, question_number, answer):
        """
        Convenience method for attaching a response to the proper field
        based on the question number. Relies on the convention that all response
        fields begin with an 'a' and end with a number, e.g. 'a5' should hold
        the response for question #5.
        :param question_number: The question number that the response is for
        :param answer: The model to be attached for the question number
        """
        key = self._get_field_name_for_question(question_number)
        setattr(self, key, answer)

    def get_answer(self, question_number):
        key = self._get_field_name_for_question(question_number)
        return getattr(self, key)
