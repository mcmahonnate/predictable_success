from datetime import datetime
from django.db import models
from django.db.models import Q
import pytz


class CouponManager(models.Manager):

    def getCoupon(self, code):
        time_now = datetime.utcnow().replace(tzinfo=pytz.utc)
        normalized_code = code.strip().upper()
        try:
            coupon = self.get(Q(code=normalized_code) & (Q(expires_at__lt=time_now) | Q(expires_at__isnull=True)))
        except Coupon.DoesNotExist:
            coupon = None
        return coupon


class Coupon(models.Model):
    objects = CouponManager()
    code = models.CharField(max_length=255)
    discount_percent = models.IntegerField()
    description = models.CharField(max_length=255)
    expires_at = models.DateTimeField(null=True, blank=True)

    @property
    def is_expired(self):
        if self.expires_at:
            time_now = datetime.utcnow().replace(tzinfo=pytz.utc)
            return self.expires_at > time_now
        return False

    @property
    def discount_percent_human(self):
        return "%s%" % self.discount_percent

    def apply_discount(self, amount):
        discount = amount * (self.discount_percent * 0.01)
        return amount - int(discount)

    def __str__(self):
        return "%s %s percent off expiration %s" % (self.code, self.discount_percent, self.expires_at)


class Charge(models.Model):
    amount = models.IntegerField()
    coupon = models.ForeignKey(Coupon, related_name='charges', null=True, blank=True)
    stripe_id = models.CharField(max_length=255)

    def __str__(self):
        return "Charge amount ${:.2f}".format(self.amount/100)
