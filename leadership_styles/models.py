import blah
from blah.models import Comment
from django.db import models
from django.db.models import Q, F
from org.models import Employee
from datetime import datetime, date, timedelta
from model_utils import FieldTracker

VISIONARY = 0
OPERATOR = 1
PROCESSOR = 2
SYNERGIST = 3
SCORE_MULTIPLIER = 30
LEADERSHIP_STYLES = (
    (VISIONARY, 'Visionary'),
    (OPERATOR, 'Operator'),
    (PROCESSOR, 'Processor'),
    (SYNERGIST, 'Synergist'),
)
SELF = 0
OTHERS = 1
ASSESSMENT_TYPE = (
    (SELF, 'Self Assessment'),
    (OTHERS, '360 Assessment')
)


class QuestionManager(models.Manager):
    def get_next_question(self, employee_leadership_style):
        #get the last question answered
        last_question_answered = employee_leadership_style.last_question_answered

        #if we have not answered any questions start with the first question
        if last_question_answered is None:
            return self.get_first_question(assessment_type=employee_leadership_style.assessment_type)
        previous_question = last_question_answered.previous_question
        if previous_question is None:
            #if we have no previous question get the next question(s)
            next_questions = last_question_answered.next_questions
        else:
            #get any of the previous question's next questions that have not been answered
            next_questions = previous_question.next_questions.exclude(id__in=employee_leadership_style.answers.values_list('question__id', flat=True))
            if next_questions.count() == 0:
                #if we don't have any get the next question(s)
                next_questions = last_question_answered.next_questions

        if next_questions.count() > 0:
            #get the next question at random
            return next_questions.order_by('?').first()
        else:
            #if we don't have anymore questions left return None
            return None

        return self.filter()

    def get_first_question(self, assessment_type):
        question = self.get(previous_question__isnull=True, assessment_type=assessment_type, active=True)
        return question


class Question(models.Model):
    objects = QuestionManager()
    assessment_type = models.IntegerField(choices=ASSESSMENT_TYPE)
    text = models.TextField()
    randomize_answers = models.BooleanField(default=False)
    previous_question = models.ForeignKey('Question', related_name='next_questions', null=True, blank=True)
    randomize_next_questions = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    _answer = None

    @property
    def answer(self):
        return self._answer

    @answer.setter
    def answer(self, value):
        self._answer = value

    def answers(self):
        if self.randomize_answers:
            return self._answers.order_by('?')
        else:
            return self._answers.order_by('order')

    def has_siblings(self):
        if self.previous_question and self.previous_question.next_questions:
            if self.previous_question.next_questions.count() > 1:
                return True
        return False

    def __str__(self):
        return "%s %s" % (self.order, self.text)


class Answer(models.Model):
    text = models.TextField(blank=True, default='')
    leadership_style = models.IntegerField(choices=LEADERSHIP_STYLES)
    question = models.ForeignKey(Question, related_name='_answers', null=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return "%s %s - %s" % (self.order, self.text, LEADERSHIP_STYLES[self.leadership_style][1])


class EmployeeLeadershipStyleManager(models.Manager):
    def get_all_finished_for_employee(self, employee):
        return self.filter(employee=employee, assessor=employee, completed=True)

    def get_all_drafts(self):
        return self.filter(is_draft=True)

    def get_unfinished(self, employee):
        try:
            return self.get(employee=employee, assessor=employee, active=True, completed=False)
        except EmployeeLeadershipStyle.DoesNotExist:
            return None

    def get_all_unfinished(self):
        reminder_date = date.today()-timedelta(weeks=2)
        return self.filter(active=True, completed=False, date__gt=reminder_date, employee=F('assessor'))


class EmployeeLeadershipStyle(models.Model):
    objects = EmployeeLeadershipStyleManager()
    assessment_type = models.IntegerField(choices=ASSESSMENT_TYPE)
    assessor = models.ForeignKey(Employee, related_name='+')
    employee = models.ForeignKey(Employee, related_name='employee_leadership_styles')
    date = models.DateTimeField(null=False, blank=False, default=datetime.now)
    answers = models.ManyToManyField(Answer, related_name='+', null=True, blank=True)
    last_question_answered = models.ForeignKey(Question, related_name='+', null=True, blank=True)
    times_retaken = models.IntegerField(default=0)
    notes = models.TextField(blank=True, default='')
    is_draft = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    field_tracker = FieldTracker(fields=['active', 'is_draft', 'completed'])
    visionary_score = models.IntegerField(null=True, blank=True)
    operator_score = models.IntegerField(null=True, blank=True)
    processor_score = models.IntegerField(null=True, blank=True)
    synergist_score = models.IntegerField(null=True, blank=True)

    def _calculate_scores(self):
        if not self.completed and self.all_questions_answered() and self.answers.count() > 0:
            self.visionary_score = self.answers.filter(leadership_style=VISIONARY).count() * SCORE_MULTIPLIER
            self.operator_score = self.answers.filter(leadership_style=OPERATOR).count() * SCORE_MULTIPLIER
            self.processor_score = self.answers.filter(leadership_style=PROCESSOR).count() * SCORE_MULTIPLIER
            self.synergist_score = self.answers.filter(leadership_style=SYNERGIST).count() * SCORE_MULTIPLIER
            self.date = datetime.now()
            self.save()

    @property
    def total_questions(self):
        return Question.objects.filter(assessment_type=self.assessment_type, active=True).count()

    @property
    def total_answered(self):
        return self.answers.count()

    def next_question(self):
        self._calculate_scores()
        if self.completed:
            return None
        return Question.objects.get_next_question(self)

    def all_questions_answered(self):
        if self.last_question_answered is not None:
            if self.last_question_answered.has_siblings():
                previous_question = self.last_question_answered.previous_question
                questions_answered_ids = self.answers.values_list('question__id', flat=True)
                sibling_ids = previous_question.next_questions.values_list('id', flat=True)
                return set(sibling_ids).issubset(questions_answered_ids)
            else:
                try:
                    answer = self.answers.get(question__id=self.last_question_answered.id)
                    return answer.leadership_style is not None
                except Answer.DoesNotExist:
                    return self.last_question_answered.next_questions.count() == 0
        return False

    def save(self, *args, **kwargs):
        if self.completed and 'update_fields' in kwargs and 'completed' in kwargs['update_fields']:
            self.date = datetime.now()

        super(EmployeeLeadershipStyle, self).save(*args, **kwargs)

    @property
    def comments(self):
        return list(Comment.objects.get_for_object(self))

    def __str__(self):
        return "%s %s %s" % (self.employee.full_name, self.date, self.completed)