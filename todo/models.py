from django.db import models
from org.models import Employee

class Task(models.Model):
    created_by = models.ForeignKey(Employee, related_name='+')
    assigned_to = models.ForeignKey(Employee, related_name='+',null=True, blank=True)
    assigned_by = models.ForeignKey(Employee, related_name='+',null=True, blank=True)
    employee = models.ForeignKey(Employee, related_name='+')
    created_date = models.DateField(auto_now_add = True)
    due_date = models.DateField(
        null=True,
        blank=True,
    )
    description = models.CharField(
        max_length=255,
        blank=True,
    )
    completed = models.BooleanField()

    def __str__(self):
        if self.assigned_to:
            return "%s is assigned to %s" % (self.description, self.assigned_to)
        elif self.completed:
            return "%s is done" % (self.description)
        elif self.created_by:
            return "%s created task %s" % (self.created_by, self.description)
        else:
            return self.description