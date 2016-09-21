from customers.models import Customer
from datetime import datetime
from django.contrib.auth.models import User
from django.core.signing import Signer
from django.core.urlresolvers import reverse
from django.db import connection, models
from tasks import send_sign_in_link_email
import pytz


class SignInLinkManager(models.Manager):

    def create(self, email):
        user = User.objects.get(email=email)
        if user.is_active:
            customer = Customer.objects.filter(schema_name=connection.schema_name).first()
            link = SignInLink(email=email, used=False)
            link.save()
            signer = Signer()
            signed_id = signer.sign(link.id)
            url = customer.build_url(reverse('sign_in', args=[signed_id]))
            link.url = url
            link.save()
            return link
        else:
            return None


class SignInLink(models.Model):
    objects = SignInLinkManager()
    email = models.CharField(max_length=255)
    url = models.CharField(max_length=255, null=True, blank=True)
    used = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    sent_date_time = models.DateTimeField(auto_now_add=True)

    @property
    def is_expired(self):
        time_now = datetime.utcnow().replace(tzinfo=pytz.utc)
        time_difference = time_now - self.sent_date_time
        minutes_difference = time_difference.total_seconds() / 60
        if minutes_difference < 15:
            return False
        return True

    @property
    def is_valid_link(self):
        if not self.is_expired and not self.used and self.active:
            return True
        return False

    def send_sign_in_link(self):
        send_sign_in_link_email.subtask((self.id,)).apply_async()

    def __str__(self):
        return "%s was sent a sign in link on %s" % (self.email, self.sent_date_time)

