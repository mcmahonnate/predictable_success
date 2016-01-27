from django.db import models
from org.models import Employee
import datetime


class Question(models.Model):
    text = models.TextField()
    randomize_answers = models.BooleanField(default=False)
    previous_question = models.ForeignKey('Question', related_name='next_questions', null=True, blank=True)
    randomize_next_questions = models.BooleanField(default=False)

    def __str__(self):
        return self.text


class Zone(models.Model):
    name = models.CharField(
        max_length=255,
    )
    description = models.TextField(blank=True, default='')
    value = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Answer(models.Model):
    text = models.TextField(blank=True, default='')
    zone = models.ForeignKey(Zone, related_name='+', null=True, blank=True)
    question = models.ForeignKey(Question, related_name='answers', null=True)

    def __str__(self):
        return self.text


class EmployeeZone(models.Model):
    employee = models.ForeignKey(Employee, related_name='development_zone')
    date = models.DateTimeField(null=False, blank=False, default=datetime.datetime.now)
    answers = models.ManyToManyField(Answer, related_name='+', null=False, blank=False)
    zone = models.ForeignKey(Zone, related_name='+', null=True, blank=True)

    def __str__(self):
        return "%s %s %s" % (self.employee.full_name, self.zone.name, self.date)
