from django.db import models
from django.contrib.auth.models import User
import blah

class Employee(models.Model):
    full_name = models.CharField(
        max_length=255,
    )
    avatar = models.ImageField(
		upload_to="/media/avatars/%Y/%m/%d",
        max_length=100,
        blank=True,
    )
    avatar_small = models.ImageField(
		upload_to="/media/avatars/small/%Y/%m/%d",
        max_length=100,
        null=True,
        blank=True,
        default=None
    )
    job_title = models.CharField(
        max_length=255,
        blank=True,
    )
    base_camp = models.CharField(
        max_length=255,
        blank=True,
    )
    u_name = models.CharField(
        max_length=255,
        blank=True,
    )
    hire_date = models.DateField(
        null=True,
    )
    display = models.BooleanField()
    team = models.ForeignKey(
        'Team',
        null=True,
        blank=True,
        default=None
    )
    user = models.OneToOneField(User,on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.full_name

blah.register(Employee)

class Team(models.Model):
    name = models.CharField(
        max_length=255,
    )
    leader = models.OneToOneField('Employee', related_name='+')

    def __str__(self):
        return self.name

class Mentorship(models.Model):
    mentor = models.ForeignKey(Employee, related_name='+')
    mentee = models.ForeignKey(Employee, related_name='+')

    def __str__(self):
        return "%s mentor of %s" % (self.mentor.full_name, self.mentee.full_name)

class Leadership(models.Model):
    leader = models.ForeignKey(Employee, related_name='+')
    employee = models.ForeignKey(Employee, related_name='+')

    def __str__(self):
        return "%s leader of %s" % (self.leader.full_name, self.employee.full_name)

class Attribute(models.Model):
    employee = models.ForeignKey(Employee, related_name='+')
    name = models.CharField(
        max_length=255,
        blank=True,
    )
    category = models.ForeignKey(
        'AttributeCategory',
        null=True,
        blank=True,
        default=None
    )

    def __str__(self):
        return "%s is a %s" % (self.name, self.category.name)        

class AttributeCategory(models.Model):
    name = models.CharField(
        max_length=255,
        blank=True,
    )

    def __str__(self):
        return self.name        