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

    def get_summaries_for_team(self, team_id):
        most_recent_year = self.order_by('-year')[0:1].get().year
        return self.filter(employee__team__id=team_id).filter(year=most_recent_year)


class CompensationSummary(models.Model):
    objects = CompensationSummaryManager()
    USD = 'USD'
    AUD = 'AUD'
    GBP = 'GBP'
    CAD = 'CAD'
    EUR = 'EUR'
    SGP = 'SGP'
    CURRENCY_CHOICES = ((USD, 'USD'), (AUD, 'AUD'), (GBP, 'GBP'),
                        (CAD, 'CAD'), (EUR, 'EUR'), (SGP, 'SGP'),)

    employee = models.ForeignKey(Employee, related_name='comp')
    date = models.DateField(null=True,)
    currency_type = models.CharField(max_length=3, choices=CURRENCY_CHOICES, null=True, blank=True)
    year = models.IntegerField(choices=year_choices(), default=current_year,)
    fiscal_year = models.IntegerField(choices=year_choices(), default=current_year,)
    salary = models.DecimalField(max_digits=12, decimal_places=2, default=0,)
    bonus = models.DecimalField(max_digits=12, decimal_places=2, default=0,)
    discretionary = models.DecimalField(max_digits=12, decimal_places=2, default=0,)
    writer_payments_and_royalties = models.DecimalField(max_digits=12, decimal_places=2, default=0,)

    def get_total_compensation(self):
        return self.salary + self.bonus + self.discretionary + self.writer_payments_and_royalties

    def __str__(self):
        return "%s compensation FY%i" % (self.employee.full_name, self.fiscal_year)

    class Meta:
        ordering = ['year', 'fiscal_year']

    class Meta:
        permissions = (("view_compensationsummary", "Can view compensation summary"),)
