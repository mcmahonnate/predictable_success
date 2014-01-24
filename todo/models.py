from django.db import models
from org.models import Employee

class Task(models.Model):
    created_by = models.ForeignKey(Employee, related_name='+')
    assigned_to = models.ForeignKey(Employee, related_name='+',null=True, blank=True)
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
    UNASSIGNED="unassigned"
    ASSIGNED="assigned"
    DONE="done"
    STATUS_CHOICES = (
        (UNASSIGNED, 'Unassigned'),
        (ASSIGNED, 'Assigned'),
        (DONE, 'Done'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=UNASSIGNED)

    def __str__(self):
        if self.status == "assigned":
            return "%s is assigned to %s" % (self.description, self.assigned_to)
        elif self.status == "done":
            return "%s is done" % (self.description)
        elif self.created_by:
            return "%s created task %s" % (self.created_by, self.description)
        else:
            return self.description