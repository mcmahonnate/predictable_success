from django.db import models
from model_utils.models import TimeStampedModel
from org.models import Employee


class Response(TimeStampedModel):
    """
    Abstract base class model that provides common fields
    for all responses to YourStory questions.
    """
    question = models.TextField(blank=False)
    is_public = models.BooleanField(default=False)

    @property
    def question_type(self):
        return self.question_type

    class Meta:
        abstract = True


class TextResponse(Response):
    """
    A text response to a Your Story question.
    """
    question_type = 'text'
    text = models.TextField(blank=True)


class EmployeeChoiceResponse(Response):
    """
    A response to a Your Story question that consists of choosing
    one or more Employees, e.g. "Who are your favorite Fools?"
    """
    question_type = 'employeechoice'
    employees = models.ManyToManyField(Employee)


class YourStory(TimeStampedModel):
    """
    Container for all of the Your Story responses that have been collected for a
    specific Employee.
    """
    employee = models.ForeignKey(Employee, unique=True)
    a1 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a2 = models.ForeignKey(EmployeeChoiceResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a3 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a4 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a5 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a6 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a7 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a8 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a9 = models.ForeignKey(EmployeeChoiceResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a10 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a11 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a12 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a13 = models.ForeignKey(EmployeeChoiceResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a14 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a15 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a16 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a17 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a18 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a19 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a20 = models.ForeignKey(TextResponse, null=True, related_name='+', on_delete=models.SET_NULL)
    a21 = models.ForeignKey(EmployeeChoiceResponse, null=True, related_name='+', on_delete=models.SET_NULL)

    @staticmethod
    def _get_field_name_for_question(question_number):
        return 'a{}'.format(question_number)

    @property
    def total_questions(self):
        last_question_number = 0
        question_number = 1
        key = self._get_field_name_for_question(question_number)
        while hasattr(self, key):
            last_question_number = question_number
            question_number += 1
            key = self._get_field_name_for_question(question_number)
        return last_question_number

    @property
    def next_unanswered_question_number(self):
        """
        Finds the number of the next unanswered question.
        :return: The next unanswered question number, or None if all questions have been answered.
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

    @property
    def answers(self):
        """
        A way to access all of the responses as an ordered list.
        """
        answers = []
        question_number = 1
        key = self._get_field_name_for_question(question_number)
        while hasattr(self, key):
            answer = getattr(self, key)
            answers.append(answer)
            question_number += 1
            key = self._get_field_name_for_question(question_number)
        return answers

    def add_answer(self, question_number, answer):
        """
        Convenience method for attaching a response to the proper field
        based on the question number. Relies on the convention that all response
        fields begin with an 'a' and end with a number, e.g. 'a5' should hold
        the response for question #5.
        :param question_number: The question number that the response is for
        :param answer: The model to be attached for the question number.
        """
        key = self._get_field_name_for_question(question_number)
        setattr(self, key, answer)

    def get_answer(self, question_number):
        """
        Convenience method for getting a response based on the question number.
        Relies on the convention that all response fields begin with an 'a' and
        end with a number, e.g. 'a5' should hold the response for question #5.
        :param question_number: The question number to get the response for.
        """
        key = self._get_field_name_for_question(question_number)
        return getattr(self, key)
