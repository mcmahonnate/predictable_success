from django.db import models
from org.models import Employee

class AssessmentType(models.Model):
    name = models.CharField(
        max_length=255,
    )

    def __str__(self):
        return "%s" % (self.name)

class AssessmentCategory(models.Model):
    assessment = models.ForeignKey(AssessmentType, related_name='+')
    name = models.CharField(
        max_length=255,
    )

    def __str__(self):
        return "%s - %s" % (self.assessment.name, self.name)

class AssessmentBand(models.Model):
    category = models.ForeignKey(AssessmentCategory, related_name='+')
    min_value = models.IntegerField()
    max_value = models.IntegerField()
    name = models.CharField(
        max_length=255,
    )
    description = models.TextField()

    def __str__(self):
        return "%s" % (self.name)

class EmployeeAssessment(models.Model):
    employee = models.ForeignKey(Employee, related_name='+')
    category = models.ForeignKey(AssessmentCategory, related_name='+')
    score = models.IntegerField()

    def __str__(self):
        return "%s" % (self.employee.name)

class AssessmentComparison(models.Model):
    this = models.ForeignKey(AssessmentBand, related_name='+')
    that = models.ForeignKey(AssessmentBand, related_name='+')
    assessed_date = models.DateField(auto_now_add = True)
    description = models.TextField()

    def __str__(self):
        return "%s compared to %s" % (self.this.name, self.that.name)
