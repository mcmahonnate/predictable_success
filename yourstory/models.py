from django.db import models
from model_utils.models import TimeStampedModel
from org.models import Employee


class TextResponse(TimeStampedModel):
    question = models.TextField(blank=False)
    text = models.TextField(blank=True)
    is_public = models.BooleanField(default=False)


class EmployeeChoiceResponse(TimeStampedModel):
    question = models.TextField(blank=False)
    employees = models.ManyToManyField(Employee)
    is_public = models.BooleanField(default=False)


class YourStory(TimeStampedModel):
    employee = models.ForeignKey(Employee, unique=True)
    a1 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a2 = models.ForeignKey(EmployeeChoiceResponse, null=True, related_name='+')
    a3 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a4 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a5 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a6 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a7 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a8 = models.ForeignKey(TextResponse, null=True, related_name='+')
    a9 = models.ForeignKey(TextResponse, null=True, related_name='+')
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
