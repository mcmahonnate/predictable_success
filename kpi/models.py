from django.db import models

class Indicator(models.Model):
    name = models.CharField(
        max_length=255,
        blank=True,
    )

    def __str__(self):
        return self.name

class Performance(models.Model):
    value = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )
    date = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return "%s on %s" % (self.value, self.date)