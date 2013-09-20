from django.db import models

class Customer(models.Model):
    c_id = models.IntegerField()
    name = models.CharField(
        max_length=255,
    )
    subdomain = models.CharField(
        max_length=15,
    )

    def __str__(self):
        return self.name

class Employee(models.Model):
    informal_name = models.CharField(
        max_length=255,
    )
    job_title = models.CharField(
        max_length=255,
    )
    base_camp = models.CharField(
        max_length=255,
    )
    u_name = models.CharField(
        max_length=255,
    )
    date_of_hire = models.DateField()
    display = models.BooleanField()
    e_id = models.BigIntegerField()
    customer = models.ForeignKey(Customer)

    def __str__(self):
        return self.informal_name
