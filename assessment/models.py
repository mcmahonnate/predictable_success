from django.db import models
from org.models import Employee

MBTI_TYPES = (
    ('istj', 'ISTJ'),
    ('estj', 'ESTJ'),
    ('isfj', 'ISFJ'),
    ('esfj', 'ESFJ'),
    ('istp', 'ISTP'),
    ('estp', 'ESTP'),
    ('esfp', 'ESFP'),
    ('isfp', 'ISFP'),
    ('entj', 'ENTJ'),
    ('intj', 'INTJ'),
    ('entp', 'ENTP'),
    ('intp', 'INTP'),
    ('enfj', 'ENFJ'),
    ('infj', 'INFJ'),
    ('enfp', 'ENFP'),
    ('infp', 'INFP'),
)


class MBTI(models.Model):
    employee = models.ForeignKey(Employee, related_name='+')
    type = models.CharField(choices=MBTI_TYPES, max_length=4)

    def __str__(self):
        return "%s is an %s" % (self.employee.full_name, self.type)

class MBTIEmployeeDescription(models.Model):
    type = models.CharField(choices=MBTI_TYPES, max_length=4)
    description = models.TextField()

    def __str__(self):
        return "%s" % (self.type)

class MBTITeamDescription(models.Model):
    type = models.CharField(choices=MBTI_TYPES, max_length=4)
    description = models.TextField()

    def __str__(self):
        return "%s" % (self.type)

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
        return "%s" % (self.employee.full_name)

    def _get_description(self):
        try:
            bands = AssessmentBand.objects.filter(category__id=self.category.id)
            bands = bands.filter(min_value__lte=self.score)
            band = bands.filter(max_value__gte=self.score)[0]
            return band.description
        except:
            return None

    def _get_name(self):
        try:
            bands = AssessmentBand.objects.filter(category__id=self.category.id)
            bands = bands.filter(min_value__lte=self.score)
            band = bands.filter(max_value__gte=self.score)[0]
            return band.name
        except:
            return None

    @property
    def get_name(self):
        return self._get_name()

    @property
    def get_description(self):
        return self._get_description()

class AssessmentComparison(models.Model):
    this = models.ForeignKey(AssessmentBand, related_name='+')
    that = models.ForeignKey(AssessmentBand, related_name='+')
    assessed_date = models.DateField(auto_now_add = True)
    description = models.TextField()

    def __str__(self):
        return "%s compared to %s" % (self.this.name, self.that.name)

class TeamAssessmentCluster(models.Model):
    name = models.CharField(
        max_length=255,
    )
    description = models.TextField()
    bands =  models.ManyToManyField(AssessmentBand)
    def __str__(self):
        return "%s team" % (self.name)
