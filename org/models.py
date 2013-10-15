from django.db import models
import blah

class Employee(models.Model):
    informal_name = models.CharField(
        max_length=255,
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

    def __str__(self):
        return self.informal_name

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
        return "%s mentorship of %s" % (self.mentor.informal_name, self.mentee.informal_name)
