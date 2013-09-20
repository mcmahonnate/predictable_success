from django.db import models
from orgstructure.models import Employee
import datetime

class CompensationSummary(models.Model):
    YEAR_CHOICES = [(year, year) for year in range(1979, (datetime.datetime.today().year+1))]

    employee = models.ForeignKey(Employee)
    year = models.IntegerField(choices=YEAR_CHOICES, default=datetime.datetime.today().year)
    fiscal_year = models.IntegerField(choices=YEAR_CHOICES, default=datetime.datetime.today().year)
    salary = models.DecimalField(max_digits=12, decimal_places=2)
    bonus = models.DecimalField(max_digits=12, decimal_places=2)
    discretionary = models.DecimalField(max_digits=12, decimal_places=2)
    writer_payments_and_royalties = models.DecimalField(max_digits=12, decimal_places=2)
