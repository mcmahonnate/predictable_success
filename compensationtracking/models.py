from django.db import models
from orgstructure.models import Employee
import datetime

def current_year():
    return datetime.datetime.today().year

class CompensationSummary(models.Model):
    YEAR_CHOICES = [(year, year) for year in range(1979, current_year() + 1)]

    employee = models.ForeignKey(Employee)
    year = models.IntegerField(
        choices=YEAR_CHOICES,
        default=current_year,
    )
    fiscal_year = models.IntegerField(
        choices=YEAR_CHOICES,
        default=current_year,
    )
    salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    bonus = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    discretionary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    writer_payments_and_royalties = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    def total_compensation(self):
        return self.salary + self.bonus + self.discretionary + self.writer_payments_and_royalties

    def __str__(self):
        return "%s compensation FY%i" % (self.employee.informal_name, self.fiscal_year)
