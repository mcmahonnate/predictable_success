from django.db import models
from org.models import Employee
import datetime

def current_year():
    return datetime.datetime.today().year

def year_choices():
    return [(year, year) for year in range(1979, current_year() + 1)]

class CompensationSummaryManager(models.Manager):
    def get_most_recent(self):
        most_recent_year = self.order_by('-year')[0:1].get().year
        return self.filter(year=most_recent_year)

class CompensationSummary(models.Model):
    employee = models.ForeignKey(Employee)
    year = models.IntegerField(
        choices=year_choices(),
        default=current_year,
    )
    fiscal_year = models.IntegerField(
        choices=year_choices(),
        default=current_year,
    )
    salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )
    bonus = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )
    discretionary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )
    writer_payments_and_royalties = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    objects = models.Manager()
    objects = CompensationSummaryManager()

    def get_total_compensation(self):
        return self.salary + self.bonus + self.discretionary + self.writer_payments_and_royalties

    def __str__(self):
        return "%s compensation FY%i" % (self.employee.informal_name, self.fiscal_year)

    class Meta:
        ordering = ['year', 'fiscal_year']
